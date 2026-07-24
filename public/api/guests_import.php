<?php
// public/api/guests_import.php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';

// Check Auth
// Check Auth
$token = JWT::getBearerToken();

try {
    $user = JWT::decode($token);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$eventId = $_POST['eventId'] ?? '';
if (empty($eventId)) {
    http_response_code(400);
    echo json_encode(['error' => 'Event ID required']);
    exit;
}

// Verify Ownership
$stmt = $pdo->prepare("SELECT id FROM Event WHERE id = :id AND userId = :userId");
$stmt->execute(['id' => $eventId, 'userId' => $user['userId']]);
if (!$stmt->fetch()) {
    http_response_code(403);
    echo json_encode(['error' => 'Access Denied']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'File upload failed']);
    exit;
}

$file = $_FILES['file']['tmp_name'];
$handle = fopen($file, "r");
if ($handle === FALSE) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not read file']);
    exit;
}

// Skip BOM if present
$bom = fread($handle, 3);
if ($bom != "\xEF\xBB\xBF") {
    rewind($handle);
}

// Read Header
$header = fgetcsv($handle);
// Normalize header keys (lowercase, trim)
$header = array_map(function ($h) {
    return strtolower(trim($h));
}, $header);

$nameIdx = array_search('name', $header);
$phoneIdx = array_search('phonenumber', $header);

if ($nameIdx === false) {
    http_response_code(400);
    echo json_encode(['error' => 'CSV must have a "Name" column']);
    exit;
}

$importedCount = 0;
$errors = [];

$stmt = $pdo->prepare("INSERT INTO Guest (id, name, eventId, shortCode, token, status, phoneNumber) VALUES (:id, :name, :eventId, :shortCode, :token, 'PENDING', :phoneNumber)");

while (($row = fgetcsv($handle)) !== FALSE) {
    $name = $row[$nameIdx] ?? '';
    // If phone column is missing, phone is empty
    $phone = ($phoneIdx !== false) ? ($row[$phoneIdx] ?? '') : '';

    if (empty(trim($name)))
        continue;

    // Generate IDs
    $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
    $token = bin2hex(random_bytes(8));

    // Short Code
    $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $shortCode = '';
    for ($i = 0; $i < 5; $i++) {
        $shortCode .= $chars[random_int(0, strlen($chars) - 1)];
    }

    try {
        $stmt->execute([
            'id' => $uuid,
            'name' => $name,
            'eventId' => $eventId,
            'shortCode' => $shortCode,
            'token' => $token,
            'phoneNumber' => $phone
        ]);
        $importedCount++;
    } catch (Exception $e) {
        $errors[] = "Failed to import $name: " . $e->getMessage();
    }
}

fclose($handle);

echo json_encode([
    'success' => true,
    'message' => "Imported $importedCount guests successfully.",
    'errors' => $errors
]);
?>