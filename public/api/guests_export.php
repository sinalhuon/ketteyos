<?php
// public/api/guests_export.php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php'; // Ensure user is authenticated

// 1. Verify Auth
// 1. Verify Auth
$token = JWT::getBearerToken();

try {
    $user = JWT::decode($token);
} catch (Exception $e) {
    // For export, we might strictly require auth, OR allow it via a temporary token if we were fancy.
    // But since this is called from dashboard, we expect a bearer token.
    // However, basic browser download/link navigation MIGHT NOT send the bearer header easily unless we use fetch+blob.
    // If the valid token is missing, we fail.
    // User might need to pass token via query param for direct browser download.
}

$queryToken = $_GET['token'] ?? '';
if (!$user && $queryToken) {
    try {
        $user = JWT::decode($queryToken);
    } catch (Exception $e) {
        // Invalid
    }
}

if (!$user) {
    http_response_code(401);
    die('Unauthorized');
}

$eventId = $_GET['eventId'] ?? '';
if (empty($eventId)) {
    http_response_code(400);
    die('Event ID required');
}

// 2. Verify Ownership
if (!in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) && !($user['isSuperAdmin'] ?? false)) {
    $stmt = $pdo->prepare("SELECT id FROM Event WHERE id = :id AND userId = :userId");
    $stmt->execute(['id' => $eventId, 'userId' => $user['userId']]);
    if (!$stmt->fetch()) {
        http_response_code(403);
        die('Access Denied');
    }
}

// 3. Fetch Guests
$stmt = $pdo->prepare("SELECT name, phoneNumber, status, token, shortCode FROM Guest WHERE eventId = :eventId");
$stmt->execute(['eventId' => $eventId]);
$guests = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 4. Output CSV
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="guests_export.csv"');

$output = fopen('php://output', 'w');
// Add UTF-8 BOM
fprintf($output, chr(0xEF) . chr(0xBB) . chr(0xBF));

// Header
fputcsv($output, ['Name', 'PhoneNumber']);

foreach ($guests as $guest) {
    fputcsv($output, [
        $guest['name'],
        $guest['phoneNumber']
    ]);
}

fclose($output);
?>