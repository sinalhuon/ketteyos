<?php
/**
 * Migration: Add planId to User table
 * Run once: /api/migrate_plan_id.php?secret=ketteyos2024
 */
require_once 'db.php';

$secret = $_GET['secret'] ?? '';
if ($secret !== 'ketteyos2024') {
    http_response_code(403);
    echo json_encode(['error' => 'Add ?secret=ketteyos2024 to run migration']);
    exit;
}

try {
    $pdo->exec("ALTER TABLE User ADD COLUMN planId VARCHAR(191) NULL");
    echo json_encode(['success' => true, 'message' => 'planId column added to User table']);
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate column') !== false) {
        echo json_encode(['success' => true, 'message' => 'planId column already exists']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
