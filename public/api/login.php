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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);
$email = $input['email'] ?? '';
$password = $input['password'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit;
}

try {
    // Prepare statement (include planId for plan limits - run migrate_plan_id.php if column missing)
    $stmt = $pdo->prepare("SELECT id, email, password, name, role, isSuperAdmin, status, planId FROM User WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password'])) {
        // Password correct!

        // Check Status
        $allowedStatuses = ['ACTIVE', 'APPROVED'];
        if (!in_array($user['status'] ?? 'ACTIVE', $allowedStatuses)) {
            $statusMessages = [
                'INACTIVE' => 'Your account has been deactivated. Please contact an administrator.',
                'SUSPENDED' => 'Your account has been suspended. Please contact an administrator.',
                'PENDING' => 'Your account is pending approval. Please wait for an administrator to verify your account.'
            ];
            $message = $statusMessages[$user['status']] ?? 'Your account is not active. Please contact an administrator.';
            http_response_code(403);
            echo json_encode(['error' => $message]);
            exit;
        }

        // Generate JWT
        $payload = [
            'userId' => $user['id'],
            'role' => $user['role'],
            'email' => $user['email'],
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ];

        $token = JWT::encode($payload);

        // Remove password from response
        unset($user['password']);

        // Add plan and limits for CLIENT users
        $planId = $user['planId'] ?? null;
        $user['plan'] = null;
        $user['limits'] = getDefaultLimits();
        if (in_array($user['role'], ['CLIENT']) && $planId) {
            $user['plan'] = getPlanById($pdo, $planId);
            $user['limits'] = getPlanLimits($pdo, $planId);
        } elseif (in_array($user['role'], ['ADMIN', 'SUPER_ADMIN']) || ($user['isSuperAdmin'] ?? false)) {
            $user['limits'] = getDefaultLimits(); // Admins get default (unlimited handled separately)
            $user['limits']['maxEvents'] = 9999;
            $user['limits']['maxPhotos'] = 9999;
        }

        echo json_encode([
            'success' => true,
            'token' => $token,
            'user' => $user
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
    }

} catch (PDOException $e) {
    http_response_code(500);
    error_log('Login error: ' . $e->getMessage());
    echo json_encode(['error' => 'Login failed. Please try again.']);
}
?>