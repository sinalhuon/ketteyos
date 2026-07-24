<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';

// Set headers for SSE
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Cache-Control');

// Get current user from JWT
$token = JWT::getBearerToken();
$user = null;
if ($token) {
    try {
        $user = JWT::decode($token);
    } catch (Exception $e) {
        echo "data: {\"type\": \"error\", \"message\": \"Invalid token\"}\n\n";
        exit;
    }
} else {
    echo "data: {\"type\": \"error\", \"message\": \"Unauthorized\"}\n\n";
    exit;
}

$userId = $user['id'] ?? $user['userId'] ?? null;
$lastStatus = null;

if (!$userId) {
    echo "data: {\"type\": \"error\", \"message\": \"Invalid user ID\"}\n\n";
    exit;
}

// Get initial status
try {
    $stmt = $pdo->prepare("SELECT status FROM User WHERE id = :id");
    $stmt->execute(['id' => $userId]);
    $userRecord = $stmt->fetch();
    $lastStatus = $userRecord['status'] ?? null;
} catch (Exception $e) {
    echo "data: {\"type\": \"error\", \"message\": \"Database error\"}\n\n";
    exit;
}

// Send initial status
echo "data: {\"type\": \"status\", \"status\": \"$lastStatus\"}\n\n";
flush();
?>
