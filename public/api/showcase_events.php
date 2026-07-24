<?php
require_once 'cors.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $settingsStmt = $pdo->query("SELECT landingShowcaseEventIds FROM AppSettings LIMIT 1");
    $settings = $settingsStmt->fetch(PDO::FETCH_ASSOC);
    $selectedIds = [];

    if (!empty($settings['landingShowcaseEventIds'])) {
        $decoded = json_decode($settings['landingShowcaseEventIds'], true);
        if (is_array($decoded)) {
            $selectedIds = array_values(array_filter($decoded));
        }
    }

    if (!empty($selectedIds)) {
        $placeholders = implode(',', array_fill(0, count($selectedIds), '?'));
        $stmt = $pdo->prepare("SELECT id, title, slug, shareImageUrl FROM Event WHERE id IN ($placeholders)");
        $stmt->execute($selectedIds);
        $fetched = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $byId = [];
        foreach ($fetched as $event) {
            $byId[$event['id']] = $event;
        }
        $events = [];
        foreach ($selectedIds as $id) {
            if (isset($byId[$id])) {
                $events[] = $byId[$id];
            }
        }
    } else if ($settings && $settings['landingShowcaseEventIds'] === '[]') {
        $events = [];
    } else {
        $stmt = $pdo->query("SELECT id, title, slug, shareImageUrl FROM Event WHERE shareImageUrl IS NOT NULL AND shareImageUrl != '' ORDER BY createdAt DESC LIMIT 6");
        $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode([
        'success' => true,
        'events' => $events
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch showcase events: ' . $e->getMessage()]);
}
?>
