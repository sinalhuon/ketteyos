<?php
/**
 * Client plan upgrade endpoint
 * POST: Upgrade own plan (CLIENT only)
 */
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';
require_once 'plan_limits.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$token = JWT::getBearerToken();
if (!$token) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

try {
    $user = JWT::decode($token);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
    exit;
}

// Only CLIENT can upgrade their own plan
if (!in_array($user['role'] ?? '', ['CLIENT'])) {
    http_response_code(403);
    echo json_encode(['error' => 'Only clients can upgrade their plan']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$planId = $input['planId'] ?? null;

if (empty($planId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Plan ID required']);
    exit;
}

// Validate plan exists and is active
$plan = getPlanById($pdo, $planId);
if (!$plan || empty($plan['isActive'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or inactive plan']);
    exit;
}

try {
    $stmt = $pdo->prepare("UPDATE User SET planId = :planId WHERE id = :id");
    $stmt->execute(['planId' => $planId, 'id' => $user['userId']]);
    echo json_encode([
        'success' => true,
        'message' => 'Plan updated successfully',
        'plan' => $plan,
        'limits' => getPlanLimits($pdo, $planId)
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    error_log('Upgrade plan error: ' . $e->getMessage());
    echo json_encode(['error' => 'Failed to update plan']);
}
