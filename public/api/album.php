<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';
require_once 'plan_limits.php';

$token = JWT::getBearerToken();
$user = null;
if ($token) {
    try {
        $user = JWT::decode($token);
    } catch (Exception $e) {
    }
}

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$authUserId = $user['userId'] ?? $user['id'] ?? null;
if (!$authUserId) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token payload']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$isAdminUser = in_array($user['role'] ?? '', ['ADMIN', 'SUPER_ADMIN'], true) || !empty($user['isSuperAdmin']);

// POST: Add Album Photo
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['eventId']) || empty($input['url'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Event ID and URL required']);
        exit;
    }

    // Verify Ownership or admin access
    if ($isAdminUser) {
        $stmt = $pdo->prepare("SELECT id FROM Event WHERE id = :id");
        $stmt->execute(['id' => $input['eventId']]);
    } else {
        $stmt = $pdo->prepare("SELECT id FROM Event WHERE id = :id AND userId = :userId");
        $stmt->execute(['id' => $input['eventId'], 'userId' => $authUserId]);
    }
    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Access Denied']);
        exit;
    }

    // Enforce max photos limit for CLIENT (admins bypass)
    if (!$isAdminUser) {
        $limits = getUserPlanLimits($pdo, $authUserId, $user['role'] ?? null, $user['isSuperAdmin'] ?? false);
        $stmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM AlbumPhoto WHERE eventId = :eventId");
        $stmt->execute(['eventId' => $input['eventId']]);
        $count = (int) $stmt->fetch()['cnt'];
        if ($count >= $limits['maxPhotos']) {
            http_response_code(403);
            echo json_encode(['error' => 'Photo limit reached. Your plan allows up to ' . $limits['maxPhotos'] . ' photos per event. Please upgrade to add more.']);
            exit;
        }
    }

    $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));

    try {
        $stmt = $pdo->prepare("INSERT INTO AlbumPhoto (id, eventId, imageUrl, `order`) VALUES (:id, :eventId, :url, :order)");
        $stmt->execute([
            'id' => $uuid,
            'eventId' => $input['eventId'],
            'url' => $input['url'],
            'order' => $input['order'] ?? 0
        ]);
        echo json_encode(['success' => true, 'photo' => ['id' => $uuid, 'url' => $input['url']]]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('Album error: ' . $e->getMessage());
        echo json_encode(['error' => 'Operation failed. Please try again.']);
    }
}

// DELETE: Remove Album Photo
else if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Photo ID required']);
        exit;
    }

    // Verify Ownership or admin access (Join with Event)
    if ($isAdminUser) {
        $stmt = $pdo->prepare("
            SELECT ap.id
            FROM AlbumPhoto ap
            JOIN Event e ON ap.eventId = e.id
            WHERE ap.id = :id
        ");
        $stmt->execute(['id' => $id]);
    } else {
        $stmt = $pdo->prepare("
            SELECT ap.id 
            FROM AlbumPhoto ap
            JOIN Event e ON ap.eventId = e.id
            WHERE ap.id = :id AND e.userId = :userId
        ");
        $stmt->execute(['id' => $id, 'userId' => $authUserId]);
    }

    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Access Denied or Photo Not Found']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM AlbumPhoto WHERE id = :id");
    $stmt->execute(['id' => $id]);
    echo json_encode(['success' => true]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
