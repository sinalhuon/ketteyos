<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';

$token = JWT::getBearerToken();
$user = null;

try {
    if ($token) {
        $user = JWT::decode($token);
    }
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit;
}

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$type = isset($_GET['type']) ? strtoupper(trim($_GET['type'])) : null;

try {
    if ($type) {
        $stmt = $pdo->prepare("SELECT * FROM GlobalAsset WHERE type = :type ORDER BY createdAt DESC");
        $stmt->execute(['type' => $type]);
    } else {
        $stmt = $pdo->query("SELECT * FROM GlobalAsset ORDER BY createdAt DESC");
    }

    echo json_encode([
        'success' => true,
        'assets' => $stmt->fetchAll(),
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>
