<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';

// Check Authorization
// Check Authorization
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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Fetch only active templates
        $stmt = $pdo->query("SELECT * FROM Template WHERE isActive = 1 ORDER BY createdAt DESC");
        $templates = $stmt->fetchAll();
        echo json_encode(['success' => true, 'templates' => $templates]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>