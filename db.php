<?php
// Database Configuration
$host = 'localhost';

// Detect Environment
// If running on localhost:8000 or 127.0.0.1, use Local Credentials
$httpHost = $_SERVER['HTTP_HOST'] ?? '';
if (strpos($httpHost, 'localhost') !== false || strpos($httpHost, '127.0.0.1') !== false) {
    $dbname = 'kettekyu_local';
    $username = 'kettekyu_dev';
    $password = 'Ketteyos@168!'; // Local development setup
} else {
    // Production Credentials (set in hosting server environment or db.php on server)
    $dbname = getenv('DB_NAME') ?: 'dpdc519_ketteyosDB';
    $username = getenv('DB_USER') ?: 'dpdc519_ketteyos';
    $password = getenv('DB_PASS') ?: 'YOUR_PRODUCTION_DB_PASSWORD';
}

try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->exec("SET NAMES utf8mb4");

    // Set PDO options
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

} catch (PDOException $e) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please try again later.'
    ]);
    exit;
}
?>
