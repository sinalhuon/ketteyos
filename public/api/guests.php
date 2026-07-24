<?php
// DEBUG: Enable Error Reporting to see the 500 error cause
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Debug: Check required files
if (!file_exists(__DIR__ . '/cors.php'))
    die('Missing cors.php');
if (!file_exists(__DIR__ . '/db.php'))
    die('Missing db.php');
if (!file_exists(__DIR__ . '/jwt.php'))
    die('Missing jwt.php');

require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';

// Check Authorization (Optional for public RSVP/View)
// Check Authorization (Optional for public RSVP/View)
$token = JWT::getBearerToken();
$user = null;

try {
    if ($token) {
        $user = JWT::decode($token);
    }
} catch (Exception $e) {
    // Invalid token, treat as guest
}

$method = $_SERVER['REQUEST_METHOD'];

// Public Routes (No Auth Required)
$isPublicGet = $method === 'GET' && (isset($_GET['token']) || isset($_GET['code']));
$isPublicRsvp = $method === 'PATCH' && isset($_GET['token']);

if (!$user && !$isPublicGet && !$isPublicRsvp) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Auto-migrate: ensure photoUrl column exists on Guest table
try {
    $cols = $pdo->query("SHOW COLUMNS FROM Guest LIKE 'photoUrl'")->fetchAll();
    if (count($cols) === 0) {
        $pdo->exec("ALTER TABLE Guest ADD COLUMN `photoUrl` TEXT NULL");
    }
} catch (Exception $e) {
    // Ignore migration errors silently
}

switch ($method) {
    case 'GET':
        handleGet($pdo, $user);
        break;
    case 'POST':
        handlePost($pdo, $user);
        break;
    case 'DELETE':
        handleDelete($pdo, $user);
        break;
    case 'PUT':
        handlePut($pdo, $user);
        break;
    case 'PATCH':
        // For RSVP, we might use the query param token or the bearer token
        $rsvpToken = $_GET['token'] ?? $token;
        handleRsvp($pdo, $rsvpToken);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGet($pdo, $user)
{
    // Public Guest Lookup (No Auth required for Invitation View)
    if (isset($_GET['token'])) {
        $stmt = $pdo->prepare("SELECT * FROM Guest WHERE token = :token");
        $stmt->execute(['token' => $_GET['token']]);
        $guest = $stmt->fetch();
        if ($guest) {
            // Mark as Visited
            if (!$guest['isVisited']) {
                $update = $pdo->prepare("UPDATE Guest SET isVisited = 1 WHERE id = :id");
                $update->execute(['id' => $guest['id']]);
                $guest['isVisited'] = 1;
            }
            echo json_encode(['success' => true, 'guest' => $guest]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Guest not found']);
        }
        return;
    }

    if (isset($_GET['code'])) {
        $stmt = $pdo->prepare("SELECT * FROM Guest WHERE shortCode = :code");
        $stmt->execute(['code' => $_GET['code']]);
        $guest = $stmt->fetch();
        if ($guest) {
            // Mark as Visited
            if (!$guest['isVisited']) {
                $update = $pdo->prepare("UPDATE Guest SET isVisited = 1 WHERE id = :id");
                $update->execute(['id' => $guest['id']]);
                $guest['isVisited'] = 1;
            }
            echo json_encode(['success' => true, 'guest' => $guest]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Guest not found']);
        }
        return;
    }

    // Authenticated: List Guests for Event
    $eventId = $_GET['eventId'] ?? '';
    if (empty($eventId)) {
        http_response_code(400);
        echo json_encode(['error' => 'Event ID required']);
        return;
    }

    // Verify Ownership
    if (!in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) && !($user['isSuperAdmin'] ?? false)) {
        $stmt = $pdo->prepare("SELECT id FROM Event WHERE id = :id AND userId = :userId");
        $stmt->execute(['id' => $eventId, 'userId' => $user['userId']]);
        if (!$stmt->fetch()) {
            http_response_code(403);
            echo json_encode(['error' => 'Access Denied']);
            return;
        }
    }

    $stmt = $pdo->prepare("SELECT * FROM Guest WHERE eventId = :eventId ORDER BY id DESC");
    $stmt->execute(['eventId' => $eventId]);
    $guests = $stmt->fetchAll();
    echo json_encode(['success' => true, 'guests' => $guests]);
}

function handlePost($pdo, $user)
{
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['eventId']) || empty($input['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Event ID and Name are required']);
        return;
    }

    // Verify Ownership
    if (!in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) && !($user['isSuperAdmin'] ?? false)) {
        $stmt = $pdo->prepare("SELECT id FROM Event WHERE id = :id AND userId = :userId");
        $stmt->execute(['id' => $input['eventId'], 'userId' => $user['userId']]);
        if (!$stmt->fetch()) {
            http_response_code(403);
            echo json_encode(['error' => 'Access Denied']);
            return;
        }
    }

    $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
    $token = bin2hex(random_bytes(8)); // Simple token

    // Generate Short Code (5 chars, uppercase)
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No I, O, 1, 0 to avoid confusion
    $shortCode = '';
    for ($i = 0; $i < 5; $i++) {
        $shortCode .= $chars[random_int(0, strlen($chars) - 1)];
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO Guest (id, name, eventId, shortCode, token, status, phoneNumber, email, photoUrl) VALUES (:id, :name, :eventId, :shortCode, :token, 'PENDING', :phoneNumber, :email, :photoUrl)");
        $data = [
            'id' => $uuid,
            'name' => $input['name'],
            'eventId' => $input['eventId'],
            'shortCode' => $shortCode,
            'token' => $token,
            'phoneNumber' => $input['phoneNumber'] ?? null,
            'email' => $input['email'] ?? null,
            'photoUrl' => $input['photoUrl'] ?? null
        ];
        $stmt->execute($data);

        // Return full guest object
        $data['status'] = 'PENDING';
        echo json_encode(['success' => true, 'guest' => $data]);
    } catch (PDOException $e) {
        http_response_code(500);
        error_log('Guest operation error: ' . $e->getMessage());
        echo json_encode(['error' => 'Operation failed. Please try again.']);
    }
}

function handleRsvp($pdo, $token)
{
    $input = json_decode(file_get_contents('php://input'), true);
    $status = $input['status'] ?? ''; // ACCEPTED, DECLINED

    if (!in_array($status, ['ACCEPTED', 'DECLINED'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid status']);
        return;
    }

    $stmt = $pdo->prepare("UPDATE Guest SET status = :status WHERE token = :token");
    $stmt->execute(['status' => $status, 'token' => $token]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Guest not found']);
    }
}

function handleDelete($pdo, $user)
{
    $id = $_GET['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Guest ID required']);
        return;
    }

    // Verify Ownership via Event
    if (in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) || ($user['isSuperAdmin'] ?? false)) {
        // Admin can delete any guest
        $stmt = $pdo->prepare("SELECT id FROM Guest WHERE id = :id");
        $stmt->execute(['id' => $id]);
    } else {
        // Check if the guest belongs to an event owned by the user
        $stmt = $pdo->prepare("
            SELECT g.id 
            FROM Guest g 
            JOIN Event e ON g.eventId = e.id 
            WHERE g.id = :id AND e.userId = :userId
        ");
        $stmt->execute(['id' => $id, 'userId' => $user['userId']]);
    }

    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Access Denied or Guest Not Found']);
        return;
    }

    // Delete Guest
    $stmt = $pdo->prepare("DELETE FROM Guest WHERE id = :id");
    $stmt->execute(['id' => $id]);

    echo json_encode(['success' => true]);
}

function handlePut($pdo, $user)
{
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Guest ID required']);
        return;
    }

    // Verify Ownership via Event
    if (in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) || ($user['isSuperAdmin'] ?? false)) {
        // Admin can edit any guest
        $stmt = $pdo->prepare("SELECT id FROM Guest WHERE id = :id");
        $stmt->execute(['id' => $input['id']]);
    } else {
        $stmt = $pdo->prepare("
            SELECT g.id 
            FROM Guest g 
            JOIN Event e ON g.eventId = e.id 
            WHERE g.id = :id AND e.userId = :userId
        ");
        $stmt->execute(['id' => $input['id'], 'userId' => $user['userId']]);
    }

    if (!$stmt->fetch()) {
        http_response_code(403);
        echo json_encode(['error' => 'Access Denied or Guest Not Found']);
        return;
    }

    // Update Fields
    $fields = [];
    $params = ['id' => $input['id']];

    if (isset($input['name'])) {
        $fields[] = "name = :name";
        $params['name'] = $input['name'];
    }
    if (isset($input['phoneNumber'])) {
        $fields[] = "phoneNumber = :phoneNumber";
        $params['phoneNumber'] = $input['phoneNumber'];
    }
    if (isset($input['photoUrl'])) {
        $fields[] = "photoUrl = :photoUrl";
        $params['photoUrl'] = $input['photoUrl'];
    }

    if (empty($fields)) {
        echo json_encode(['success' => true]); // No changes
        return;
    }

    $sql = "UPDATE Guest SET " . implode(', ', $fields) . " WHERE id = :id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true]);
}
?>