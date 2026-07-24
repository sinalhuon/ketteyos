<?php
/**
 * KHQR / Bakong Payment API
 * Endpoints:
 *   GET  ?action=generate   — generate a dynamic KHQR QR string for the selected plan
 *   GET  ?action=check      — poll to confirm payment (checks Bakong transaction API)
 *   POST ?action=confirm    — called after successful payment to auto-approve and return JWT
 */
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';
require_once 'plan_limits.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ── Helper: Bakong KHQR Dynamic QR Generation ─────────────────────────────────
/**
 * Generate a KHQR EMV payload string.
 * Uses NBC Bakong KHQR specification (EMV QR Code standard).
 *
 * @param string $bakongId   e.g. "youraccount@wing"
 * @param string $name       Merchant name (max 25 chars)
 * @param float  $amount     Amount in USD or KHR
 * @param string $currency   "USD" or "KHR"
 * @param string $merchantCity
 * @param string $ref        Unique merchant reference (used to verify transaction)
 * @return string  The raw QR payload string
 */
function generateKHQRPayload(string $bakongId, string $name, float $amount, string $currency = 'USD', string $merchantCity = 'PHNOM PENH', string $ref = ''): string
{
    // Currency code (ISO 4217 numeric)
    $currencyCode = ($currency === 'KHR') ? '116' : '840';

    // Format amount
    $amountStr = number_format($amount, 2, '.', ''); // always 2 dp (KHR still numeric)

    // Sanitize strings — must be ASCII printable
    $name         = strtoupper(preg_replace('/[^\x20-\x7E]/', '', $name));
    $name         = substr(trim($name) ?: 'MERCHANT', 0, 25);
    $merchantCity = strtoupper(preg_replace('/[^\x20-\x7E]/', '', $merchantCity));
    $merchantCity = substr(trim($merchantCity) ?: 'PHNOM PENH', 0, 15);
    $bakongId     = trim($bakongId);

    // EMV TLV helper
    $tlv = function (string $tag, string $value): string {
        return $tag . str_pad(strlen($value), 2, '0', STR_PAD_LEFT) . $value;
    };

    // Tag 29 — Merchant Account Info for Bakong KHQR
    // Sub-tag 00 contains the bakong account ID (e.g. name@bakong, name@aclb, etc.)
    $tag29 = $tlv('29', $tlv('00', $bakongId));

    // Build payload (dynamic = 12, static = 11)
    $payload = '000201'                              // Payload Format Indicator
        . '010212'                                   // Point of Initiation: 12 = dynamic
        . $tag29                                     // Merchant Account Info (Bakong)
        . '52045999'                                 // MCC: general services
        . $tlv('53', $currencyCode)                  // Transaction Currency
        . $tlv('54', $amountStr)                     // Transaction Amount
        . '5802KH'                                   // Country Code
        . $tlv('59', $name)                          // Merchant Name (max 25)
        . $tlv('60', $merchantCity);                 // Merchant City (max 15)

    // Tag 62 — Additional Data Field (bill reference, optional)
    if ($ref) {
        $refClean = substr(preg_replace('/[^\x20-\x7E]/', '', $ref), 0, 25);
        $payload .= $tlv('62', $tlv('05', $refClean));
    }

    $payload .= '6304'; // CRC placeholder

    // CRC-16/CCITT-FALSE
    $crc = crc16($payload);
    return $payload . strtoupper(str_pad(dechex($crc), 4, '0', STR_PAD_LEFT));
}

function crc16(string $str): int
{
    $crc = 0xFFFF;
    for ($i = 0, $len = strlen($str); $i < $len; $i++) {
        $crc ^= ord($str[$i]) << 8;
        for ($j = 0; $j < 8; $j++) {
            $crc = ($crc & 0x8000) ? (($crc << 1) ^ 0x1021) & 0xFFFF : ($crc << 1) & 0xFFFF;
        }
    }
    return $crc;
}

// ── Helper: Check Bakong Transaction ──────────────────────────────────────────
function checkBakongTransaction(string $bakongToken, string $md5): ?array
{
    $url = "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5";
    $ch  = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode(['md5' => $md5]),
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $bakongToken,
        ],
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_SSL_VERIFYPEER => false,
    ]);
    $response = curl_exec($ch);
    $err      = curl_error($ch);
    curl_close($ch);

    if ($err || !$response) return null;
    return json_decode($response, true);
}

// ── POST: generate ───────────────────────────────────────────────────────────
// Accepts form data + planId, stores pending registration, returns QR
// Does NOT create a User record yet.
if ($method === 'POST' && $action === 'generate') {
    $input  = json_decode(file_get_contents('php://input'), true) ?? [];
    $planId = $input['planId'] ?? '';
    $name   = trim($input['name'] ?? '');
    $email  = strtolower(trim($input['email'] ?? ''));
    $password    = $input['password'] ?? '';
    $phoneNumber = trim($input['phoneNumber'] ?? '');
    $telegram    = trim($input['telegram'] ?? '');

    if (!$planId || !$name || !$email || !$password || !$phoneNumber) {
        http_response_code(400);
        echo json_encode(['error' => 'planId, name, email, password, and phoneNumber are required']);
        exit;
    }

    // Check if email already exists
    try {
        $chk = $pdo->prepare("SELECT id FROM User WHERE email = :email");
        $chk->execute(['email' => $email]);
        if ($chk->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Email already registered. Please log in.']);
            exit;
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'DB error: ' . $e->getMessage()]);
        exit;
    }

    // Load Bakong settings
    try {
        $stmt = $pdo->query("SELECT bakongToken, bakongAccountId, bakongAccountName, bakongMerchantCity FROM AppSettings LIMIT 1");
        $settings = $stmt->fetch();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Payment settings could not be loaded. Please update the database schema.']);
        exit;
    }

    if (!$settings || empty($settings['bakongAccountId'])) {
        http_response_code(503);
        echo json_encode(['error' => 'Payment not configured. Please contact administrator.']);
        exit;
    }

    // Get plan price
    $plan = getPlanById($pdo, $planId);
    if (!$plan || empty($plan['isActive'])) {
        http_response_code(404);
        echo json_encode(['error' => 'Plan not found']);
        exit;
    }

    $price    = (float)($plan['price'] ?? 0);
    $currency = strtoupper(trim($plan['currency'] ?? 'USD'));
    if (!in_array($currency, ['USD', 'KHR'])) $currency = 'USD';

    // Generate unique reference
    $ref = 'KYS-' . strtoupper(substr(md5(uniqid($planId . $email, true)), 0, 12));

    // Build QR payload
    $qrPayload = generateKHQRPayload(
        $settings['bakongAccountId'],
        $settings['bakongAccountName'] ?? 'KETTEYOS',
        $price,
        $currency,
        $settings['bakongMerchantCity'] ?? 'PHNOM PENH',
        $ref
    );

    $md5 = md5($qrPayload);

    // Hash password and store pending registration alongside transaction
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    try {
        $txId = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
        $stmt = $pdo->prepare("INSERT INTO KhqrTransaction
            (id, planId, qrPayload, md5Hash, ref, amount, currency, regName, regEmail, regPasswordHash, regPhone, regTelegram)
            VALUES (:id, :pid, :qr, :md5, :ref, :amount, :cur, :rname, :remail, :rpass, :rphone, :rtg)");
        $stmt->execute([
            'id'     => $txId,
            'pid'    => $planId,
            'qr'     => $qrPayload,
            'md5'    => $md5,
            'ref'    => $ref,
            'amount' => $price,
            'cur'    => $currency,
            'rname'  => $name,
            'remail' => $email,
            'rpass'  => $hashedPassword,
            'rphone' => $phoneNumber,
            'rtg'    => $telegram ?: null,
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create transaction: ' . $e->getMessage()]);
        exit;
    }

    echo json_encode([
        'success'    => true,
        'qrPayload'  => $qrPayload,
        'txId'       => $txId,
        'ref'        => $ref,
        'amount'     => $price,
        'currency'   => $currency,
        'planName'   => $plan['nameEn'] ?? $plan['name'] ?? '',
        'bankName'   => $settings['bakongAccountName'] ?? '',
        'accountId'  => $settings['bakongAccountId'],
    ]);
    exit;
}

// ── GET: generate (probe only — check if KHQR is configured) ─────────────────
if ($method === 'GET' && $action === 'generate') {
    $planId = $_GET['planId'] ?? '';
    // Load Bakong settings
    try {
        $stmt = $pdo->query("SELECT bakongAccountId FROM AppSettings LIMIT 1");
        $settings = $stmt->fetch();
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Payment not configured']);
        exit;
    }
    if (!$settings || empty($settings['bakongAccountId'])) {
        echo json_encode(['error' => 'Payment not configured. Please contact administrator.']);
        exit;
    }
    if ($planId === '__probe__') {
        // Probe: KHQR is configured
        echo json_encode(['success' => true, 'configured' => true]);
        exit;
    }
    // Get plan
    $plan = getPlanById($pdo, $planId);
    if (!$plan) {
        echo json_encode(['error' => 'Plan not found']);
        exit;
    }
    echo json_encode(['success' => true, 'configured' => true]);
    exit;
}

// ── GET: getqr — retrieve stored QR payload for a transaction ────────────────
if ($method === 'GET' && $action === 'getqr') {
    $txId = $_GET['txId'] ?? '';
    if (!$txId) {
        http_response_code(400);
        echo json_encode(['error' => 'txId required']);
        exit;
    }
    try {
        $stmt = $pdo->prepare("SELECT qrPayload, amount, currency FROM KhqrTransaction WHERE id = :id");
        $stmt->execute(['id' => $txId]);
        $tx = $stmt->fetch();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'DB error']);
        exit;
    }
    if (!$tx) {
        http_response_code(404);
        echo json_encode(['error' => 'Transaction not found']);
        exit;
    }
    // Load merchant display name
    $bankName = '';
    try {
        $s = $pdo->query("SELECT bakongAccountName FROM AppSettings LIMIT 1");
        $r = $s->fetch();
        $bankName = $r['bakongAccountName'] ?? '';
    } catch (Exception $e) {}

    echo json_encode([
        'success'    => true,
        'qrPayload'  => $tx['qrPayload'],
        'amount'     => $tx['amount'],
        'currency'   => $tx['currency'],
        'bankName'   => $bankName,
    ]);
    exit;
}

// ── GET: check ────────────────────────────────────────────────────────────────
if ($method === 'GET' && $action === 'check') {
    $txId = $_GET['txId'] ?? '';
    if (!$txId) {
        http_response_code(400);
        echo json_encode(['error' => 'txId required']);
        exit;
    }

    // Load transaction
    try {
        $stmt = $pdo->prepare("SELECT * FROM KhqrTransaction WHERE id = :id");
        $stmt->execute(['id' => $txId]);
        $tx = $stmt->fetch();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'DB error']);
        exit;
    }

    if (!$tx) {
        http_response_code(404);
        echo json_encode(['error' => 'Transaction not found']);
        exit;
    }

    // Already confirmed?
    if ($tx['status'] === 'PAID') {
        echo json_encode(['success' => true, 'paid' => true, 'status' => 'PAID']);
        exit;
    }

    // Load Bakong token
    try {
        $stmt = $pdo->query("SELECT bakongToken FROM AppSettings LIMIT 1");
        $settings = $stmt->fetch();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Settings DB error']);
        exit;
    }

    if (empty($settings['bakongToken'])) {
        // No token configured — cannot verify via API
        // Fallback: just return pending
        echo json_encode(['success' => true, 'paid' => false, 'status' => 'PENDING']);
        exit;
    }

    // Ask Bakong API
    $result = checkBakongTransaction($settings['bakongToken'], $tx['md5Hash']);

    if ($result && isset($result['responseCode']) && $result['responseCode'] === 0) {
        // Payment confirmed!
        $pdo->prepare("UPDATE KhqrTransaction SET status = 'PAID', paidAt = NOW() WHERE id = :id")
            ->execute(['id' => $txId]);
        echo json_encode(['success' => true, 'paid' => true, 'status' => 'PAID']);
    } else {
        echo json_encode(['success' => true, 'paid' => false, 'status' => 'PENDING']);
    }
    exit;
}

// ── POST: confirm ─────────────────────────────────────────────────────────────
// Called after payment verified to register+approve user and return JWT token
if ($method === 'POST' && $action === 'confirm') {
    $input = json_decode(file_get_contents('php://input'), true);
    $txId  = $input['txId'] ?? '';

    if (!$txId) {
        http_response_code(400);
        echo json_encode(['error' => 'txId required']);
        exit;
    }

    // Verify transaction is PAID
    try {
        $stmt = $pdo->prepare("SELECT * FROM KhqrTransaction WHERE id = :id AND status = 'PAID'");
        $stmt->execute(['id' => $txId]);
        $tx = $stmt->fetch();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'DB error']);
        exit;
    }

    if (!$tx) {
        http_response_code(402);
        echo json_encode(['error' => 'Payment not confirmed yet']);
        exit;
    }

    // If user already created for this transaction, just re-issue JWT
    if (!empty($tx['userId'])) {
        $stmt = $pdo->prepare("SELECT id, email, name, role, phoneNumber, telegram, planId FROM User WHERE id = :id");
        $stmt->execute(['id' => $tx['userId']]);
        $user = $stmt->fetch();
        if ($user) {
            $token = JWT::encode(['userId' => $user['id'], 'email' => $user['email'], 'role' => $user['role'], 'name' => $user['name'], 'planId' => $user['planId']]);
            echo json_encode(['success' => true, 'token' => $token, 'user' => ['id' => $user['id'], 'email' => $user['email'], 'name' => $user['name'], 'role' => $user['role'], 'planId' => $user['planId']]]);
            exit;
        }
    }

    // Need registration data stored in transaction
    if (empty($tx['regEmail']) || empty($tx['regPasswordHash'])) {
        http_response_code(422);
        echo json_encode(['error' => 'Registration data missing from transaction']);
        exit;
    }

    // Guard: check if email already registered
    try {
        $chk = $pdo->prepare("SELECT id FROM User WHERE email = :email");
        $chk->execute(['email' => $tx['regEmail']]);
        $existing = $chk->fetch();
    } catch (PDOException $e) { $existing = null; }

    if ($existing) {
        // Already exists — approve it and issue JWT
        $pdo->prepare("UPDATE User SET status = 'APPROVED', planId = :planId WHERE email = :email")
            ->execute(['planId' => $tx['planId'], 'email' => $tx['regEmail']]);
        $stmt = $pdo->prepare("SELECT id, email, name, role, phoneNumber, telegram, planId FROM User WHERE email = :email");
        $stmt->execute(['email' => $tx['regEmail']]);
        $user = $stmt->fetch();
    } else {
        // Create brand-new APPROVED user (no prior DB record)
        try {
            $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
            $stmt = $pdo->prepare(
                "INSERT INTO User (id, email, password, name, phoneNumber, telegram, role, status, planId, createdAt)
                 VALUES (:id, :email, :password, :name, :phoneNumber, :telegram, 'CLIENT', 'APPROVED', :planId, NOW())"
            );
            $stmt->execute([
                'id'          => $uuid,
                'email'       => $tx['regEmail'],
                'password'    => $tx['regPasswordHash'],
                'name'        => $tx['regName'],
                'phoneNumber' => $tx['regPhone'],
                'telegram'    => $tx['regTelegram'] ?: null,
                'planId'      => $tx['planId'],
            ]);
            $pdo->prepare("UPDATE KhqrTransaction SET userId = :uid WHERE id = :id")
                ->execute(['uid' => $uuid, 'id' => $txId]);
            $stmt = $pdo->prepare("SELECT id, email, name, role, phoneNumber, telegram, planId FROM User WHERE id = :id");
            $stmt->execute(['id' => $uuid]);
            $user = $stmt->fetch();
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create user: ' . $e->getMessage()]);
            exit;
        }
    }

    if (!$user) {
        http_response_code(500);
        echo json_encode(['error' => 'User creation failed']);
        exit;
    }

    // Issue JWT
    $token = JWT::encode([
        'userId'    => $user['id'],
        'email'     => $user['email'],
        'role'      => $user['role'],
        'name'      => $user['name'],
        'planId'    => $user['planId'],
    ]);

    // Send Telegram notification
    try {
        $stmtSettings = $pdo->query("SELECT telegramBotToken, telegramChatId, bakongAccountName FROM AppSettings LIMIT 1");
        $appSettings = $stmtSettings->fetch();
        if ($appSettings && !empty($appSettings['telegramBotToken']) && !empty($appSettings['telegramChatId'])) {
            $msg = "✅ *Payment Confirmed — Auto Approved*\n\n" .
                "👤 *Name:* " . $user['name'] . "\n" .
                "📧 *Email:* " . $user['email'] . "\n" .
                "💰 *Amount:* " . $tx['currency'] . " " . $tx['amount'] . "\n" .
                "🏦 *Ref:* `" . $tx['ref'] . "`\n" .
                "🕒 *Time:* " . date('Y-m-d H:i:s') . "\n\n" .
                "Account has been automatically approved.";
            $ch = curl_init("https://api.telegram.org/bot{$appSettings['telegramBotToken']}/sendMessage");
            curl_setopt_array($ch, [
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => ['chat_id' => $appSettings['telegramChatId'], 'text' => $msg, 'parse_mode' => 'Markdown'],
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_TIMEOUT        => 5,
            ]);
            @curl_exec($ch);
            curl_close($ch);
        }
    } catch (Exception $e) { /* Notification errors don't fail the request */ }

    echo json_encode([
        'success' => true,
        'token'   => $token,
        'user'    => [
            'id'     => $user['id'],
            'email'  => $user['email'],
            'name'   => $user['name'],
            'role'   => $user['role'],
            'planId' => $user['planId'],
        ],
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Invalid action']);
