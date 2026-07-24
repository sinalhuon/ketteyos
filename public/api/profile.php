<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';
require_once 'plan_limits.php';

// Check Authorization
$token = JWT::getBearerToken();
$user = null;

if ($token) {
    try {
        $user = JWT::decode($token);
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $authUserId = $user['userId'] ?? $user['id'] ?? null;
        if (!$authUserId) {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid token payload']);
            exit;
        }

        // Get fresh user data from database
        try {
            $stmt = $pdo->prepare("SELECT id, email, name, role, status, profileImage, planId, createdAt, updatedAt FROM User WHERE id = ?");
            $stmt->execute([$authUserId]);
            $freshUserData = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Older schemas may not have planId yet.
            if (strpos($e->getMessage(), 'planId') !== false) {
                $stmt = $pdo->prepare("SELECT id, email, name, role, status, profileImage, createdAt, updatedAt FROM User WHERE id = ?");
                $stmt->execute([$authUserId]);
                $freshUserData = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($freshUserData && !array_key_exists('planId', $freshUserData)) {
                    $freshUserData['planId'] = null;
                }
            } else {
                throw $e;
            }
        }

        if (!$freshUserData) {
            http_response_code(404);
            echo json_encode(['error' => 'User not found']);
            exit;
        }

        // Get plan details if user has a plan
        $plan = null;
        if (!empty($freshUserData['planId'])) {
            try {
                $stmt = $pdo->prepare("SELECT id, name, nameEn FROM PricingPlan WHERE id = ? AND isActive = 1");
                $stmt->execute([$freshUserData['planId']]);
                $planData = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($planData) {
                    $plan = [
                        'id' => $planData['id'],
                        'name' => $planData['name'],
                        'nameEn' => $planData['nameEn'] ?? null
                    ];
                }
            } catch (PDOException $e) {
                // If the PricingPlan table does not exist yet, just return no plan details.
                error_log("Profile plan lookup skipped: " . $e->getMessage());
            }
        }

        // Get user limits
        $limits = getPlanLimits($pdo, $freshUserData['planId'] ?? null);

        // Construct user response
        $responseUser = [
            'id' => $freshUserData['id'],
            'email' => $freshUserData['email'],
            'name' => $freshUserData['name'],
            'role' => $freshUserData['role'],
            'status' => $freshUserData['status'],
            'profileImage' => $freshUserData['profileImage'],
            'planId' => $freshUserData['planId'],
            'plan' => $plan,
            'limits' => $limits,
            'isSuperAdmin' => $freshUserData['role'] === 'SUPER_ADMIN'
        ];

        echo json_encode([
            'success' => true,
            'user' => $responseUser
        ]);

    } catch (Exception $e) {
        error_log("Profile endpoint error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
