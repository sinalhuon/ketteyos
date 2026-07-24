<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';
require_once 'plan_limits.php';

date_default_timezone_set('Asia/Phnom_Penh');

$token = JWT::getBearerToken();
$user = null;

if ($token) {
    try {
        $user = JWT::decode($token);
    } catch (Exception $e) {
        $user = null;
    }
}

ensureDigitalWishTable($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($pdo, $user);
        break;
    case 'POST':
        handlePost($pdo, $user);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function ensureDigitalWishTable(PDO $pdo): void
{
    static $initialized = false;
    if ($initialized) {
        return;
    }

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `DigitalWish` (
            `id` varchar(191) NOT NULL,
            `eventId` varchar(191) NOT NULL,
            `guestCode` varchar(191) DEFAULT NULL,
            `name` varchar(191) NOT NULL,
            `message` text NOT NULL,
            `rating` tinyint DEFAULT NULL,
            `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
            PRIMARY KEY (`id`),
            KEY `DigitalWish_eventId_idx` (`eventId`),
            KEY `DigitalWish_createdAt_idx` (`createdAt`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    try {
        $cols = $pdo->query("SHOW COLUMNS FROM `DigitalWish` LIKE 'rating'")->fetchAll();
        if (count($cols) === 0) {
            $pdo->exec("ALTER TABLE `DigitalWish` ADD COLUMN `rating` tinyint DEFAULT NULL AFTER `message`");
        }
    } catch (Throwable $e) {
        // Keep wishes working even if the database user cannot alter schema automatically.
    }

    $initialized = true;
}

function getEventWithPlan(PDO $pdo, string $eventId): ?array
{
    $stmt = $pdo->prepare("
        SELECT e.id, e.userId, u.role, u.isSuperAdmin
        FROM Event e
        LEFT JOIN User u ON e.userId = u.id
        WHERE e.id = :id
        LIMIT 1
    ");
    $stmt->execute(['id' => $eventId]);
    $event = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$event) {
        return null;
    }

    $limits = getUserPlanLimits(
        $pdo,
        $event['userId'],
        $event['role'] ?? null,
        !empty($event['isSuperAdmin'])
    );

    $event['limits'] = $limits;
    return $event;
}

function handleGet(PDO $pdo, $user): void
{
    $eventId = trim($_GET['eventId'] ?? '');
    $guestCode = trim($_GET['guestCode'] ?? '');
    $guestName = trim($_GET['guestName'] ?? '');
    if ($eventId === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Event ID required']);
        return;
    }

    $event = getEventWithPlan($pdo, $eventId);
    if (!$event) {
        http_response_code(404);
        echo json_encode(['error' => 'Event not found']);
        return;
    }

    if (empty($event['limits']['digitalWishes'])) {
        echo json_encode(['success' => true, 'wishes' => [], 'enabled' => false]);
        return;
    }

    if ($user && !in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) && !($user['isSuperAdmin'] ?? false)) {
        if (($user['userId'] ?? null) !== $event['userId']) {
            $user = null;
        }
    }

    $limit = $user ? 100 : 30;
    $stmt = $pdo->prepare("
        SELECT id, eventId, guestCode, name, message, rating, createdAt
        FROM DigitalWish
        WHERE eventId = :eventId
        ORDER BY createdAt DESC
        LIMIT $limit
    ");
    $stmt->execute(['eventId' => $eventId]);
    $wishes = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $viewerWish = null;
    if ($guestCode !== '') {
        $stmtViewer = $pdo->prepare("
            SELECT id, eventId, guestCode, name, message, rating, createdAt
            FROM DigitalWish
            WHERE eventId = :eventId AND guestCode = :guestCode
            LIMIT 1
        ");
        $stmtViewer->execute(['eventId' => $eventId, 'guestCode' => $guestCode]);
        $viewerWish = $stmtViewer->fetch(PDO::FETCH_ASSOC) ?: null;
    } elseif ($guestName !== '') {
        $stmtViewer = $pdo->prepare("
            SELECT id, eventId, guestCode, name, message, rating, createdAt
            FROM DigitalWish
            WHERE eventId = :eventId AND name = :name
            ORDER BY createdAt DESC
            LIMIT 1
        ");
        $stmtViewer->execute(['eventId' => $eventId, 'name' => $guestName]);
        $viewerWish = $stmtViewer->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    echo json_encode(['success' => true, 'enabled' => true, 'wishes' => $wishes, 'viewerWish' => $viewerWish]);
}

function handlePost(PDO $pdo, $user): void
{
    $input = json_decode(file_get_contents('php://input'), true) ?: [];

    $eventId = trim($input['eventId'] ?? '');
    $name = trim($input['name'] ?? '');
    $message = trim($input['message'] ?? '');
    $guestCode = trim($input['guestCode'] ?? '');
    $rating = null;
    if (array_key_exists('rating', $input) && $input['rating'] !== null && $input['rating'] !== '') {
        if (!is_numeric($input['rating'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Rating must be a number from 0 to 5']);
            return;
        }
        $rating = (int) $input['rating'];
        if ($rating < 0 || $rating > 5) {
            http_response_code(400);
            echo json_encode(['error' => 'Rating must be between 0 and 5']);
            return;
        }
    }

    if ($eventId === '' || $name === '' || $message === '') {
        http_response_code(400);
        echo json_encode(['error' => 'Event ID, name, and message are required']);
        return;
    }

    if (mb_strlen($name) > 120) {
        http_response_code(400);
        echo json_encode(['error' => 'Name is too long']);
        return;
    }

    if (mb_strlen($message) > 1000) {
        http_response_code(400);
        echo json_encode(['error' => 'Message is too long']);
        return;
    }

    $event = getEventWithPlan($pdo, $eventId);
    if (!$event) {
        http_response_code(404);
        echo json_encode(['error' => 'Event not found']);
        return;
    }

    if (empty($event['limits']['digitalWishes'])) {
        http_response_code(403);
        echo json_encode(['error' => 'Digital wishes are not enabled for this event']);
        return;
    }

    $existingWish = null;
    if ($guestCode !== '') {
        $stmtExisting = $pdo->prepare("
            SELECT id, createdAt
            FROM DigitalWish
            WHERE eventId = :eventId AND guestCode = :guestCode
            LIMIT 1
        ");
        $stmtExisting->execute([
            'eventId' => $eventId,
            'guestCode' => $guestCode,
        ]);
        $existingWish = $stmtExisting->fetch(PDO::FETCH_ASSOC) ?: null;
    } else {
        $stmtExisting = $pdo->prepare("
            SELECT id, createdAt
            FROM DigitalWish
            WHERE eventId = :eventId AND name = :name
            ORDER BY createdAt DESC
            LIMIT 1
        ");
        $stmtExisting->execute([
            'eventId' => $eventId,
            'name' => $name,
        ]);
        $existingWish = $stmtExisting->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    if ($existingWish) {
        $stmt = $pdo->prepare("
            UPDATE DigitalWish
            SET name = :name, message = :message, rating = :rating, guestCode = :guestCode
            WHERE id = :id
        ");
        $stmt->execute([
            'id' => $existingWish['id'],
            'guestCode' => $guestCode !== '' ? $guestCode : null,
            'name' => $name,
            'message' => $message,
            'rating' => $rating,
        ]);

        echo json_encode([
            'success' => true,
            'updated' => true,
            'wish' => [
                'id' => $existingWish['id'],
                'eventId' => $eventId,
                'guestCode' => $guestCode !== '' ? $guestCode : null,
                'name' => $name,
                'message' => $message,
                'rating' => $rating,
                'createdAt' => $existingWish['createdAt'],
            ]
        ]);
        return;
    }

    $id = bin2hex(random_bytes(16));
    $stmt = $pdo->prepare("
        INSERT INTO DigitalWish (id, eventId, guestCode, name, message, rating)
        VALUES (:id, :eventId, :guestCode, :name, :message, :rating)
    ");
    $stmt->execute([
        'id' => $id,
        'eventId' => $eventId,
        'guestCode' => $guestCode !== '' ? $guestCode : null,
        'name' => $name,
        'message' => $message,
        'rating' => $rating,
    ]);

    echo json_encode([
        'success' => true,
        'wish' => [
            'id' => $id,
            'eventId' => $eventId,
            'guestCode' => $guestCode !== '' ? $guestCode : null,
            'name' => $name,
            'message' => $message,
            'rating' => $rating,
            'createdAt' => date('Y-m-d H:i:s'),
        ]
    ]);
}
