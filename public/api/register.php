<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';
require_once 'plan_limits.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';
$name = $input['name'] ?? '';
$phoneNumber = $input['phoneNumber'] ?? '';
$telegram = $input['telegram'] ?? '';
$planId = $input['planId'] ?? null;

if (empty($email) || empty($password) || empty($name) || empty($phoneNumber)) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, password, and phone number are required']);
    exit;
}

try {
    // Validate planId if provided (must be an active plan)
    if ($planId) {
        $plan = getPlanById($pdo, $planId);
        if (!$plan || empty($plan['isActive'])) {
            $planId = null; // Fall back to no plan if invalid
        }
    }

    // Check if user exists
    $stmt = $pdo->prepare("SELECT id FROM User WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'User already exists']);
        exit;
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4)); // Simple UUID v4 polyfill

    // Insert user (planId optional - validated against active plans if provided)
    // Auto-activate accounts on registration
    $sql = "INSERT INTO User (id, email, password, name, phoneNumber, telegram, role, status, planId, createdAt) VALUES (:id, :email, :password, :name, :phoneNumber, :telegram, 'CLIENT', 'ACTIVE', :planId, NOW())";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'id' => $uuid,
        'email' => $email,
        'password' => $hashedPassword,
        'name' => $name,
        'phoneNumber' => $phoneNumber,
        'telegram' => $telegram,
        'planId' => $planId,
    ]);

    // Generate token for auto-login
    $tokenPayload = [
        'id' => $uuid,
        'email' => $email,
        'name' => $name,
        'role' => 'CLIENT',
        'planId' => $planId,
        'iat' => time(),
        'exp' => time() + (7 * 24 * 60 * 60) // 7 days
    ];
    $token = JWT::encode($tokenPayload);

    // --- Telegram Notification ---
    try {
        $stmtSettings = $pdo->query("SELECT telegramBotToken, telegramChatId FROM AppSettings LIMIT 1");
        $settings = $stmtSettings->fetch();

        if ($settings && !empty($settings['telegramBotToken']) && !empty($settings['telegramChatId'])) {
            $botToken = $settings['telegramBotToken'];
            $chatId = $settings['telegramChatId'];

            $message = "🔔 *New User Registration*\n\n" .
                "👤 *Name:* " . $name . "\n" .
                "📧 *Email:* " . $email . "\n" .
                "📱 *Phone:* " . $phoneNumber . "\n" .
                "💬 *Telegram:* " . ($telegram ?: 'Not provided') . "\n" .
                "🕒 *Time:* " . date('Y-m-d H:i:s') . "\n\n" .
                "Please check the admin panel to approve this user.";

            // Send message via Telegram API using cURL
            $url = "https://api.telegram.org/bot$botToken/sendMessage";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, [
                'chat_id' => $chatId,
                'text' => $message,
                'parse_mode' => 'Markdown'
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($ch, CURLOPT_TIMEOUT, 5);
            @curl_exec($ch);
            curl_close($ch);
        }
    } catch (Exception $e) {
        // Ignore notification errors to not fail registration
        error_log("Telegram notification failed: " . $e->getMessage());
    }
    // --- End Notification ---

    echo json_encode([
        'success' => true,
        'userId'  => $uuid,
        'token'   => $token,
        'user'    => [
            'id' => $uuid,
            'email' => $email,
            'name' => $name,
            'role' => 'CLIENT',
            'planId' => $planId,
            'status' => 'ACTIVE'
        ],
        'message' => 'Registration successful! Welcome aboard.'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    error_log('Register error: ' . $e->getMessage());
    echo json_encode(['error' => 'Registration failed. Please try again.']);
}
?>
