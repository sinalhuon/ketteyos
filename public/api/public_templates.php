<?php
require_once 'cors.php';
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

try {
    $settingsStmt = $pdo->query("SELECT landingTemplateIds FROM AppSettings LIMIT 1");
    $settings = $settingsStmt->fetch(PDO::FETCH_ASSOC);
    $selectedIds = [];

    if (!empty($settings['landingTemplateIds'])) {
        $decoded = json_decode($settings['landingTemplateIds'], true);
        if (is_array($decoded)) {
            $selectedIds = array_values(array_filter($decoded));
        }
    }

    if (!empty($selectedIds)) {
        $placeholders = implode(',', array_fill(0, count($selectedIds), '?'));
        $stmt = $pdo->prepare("SELECT id, name, description, previewUrl, codeKey, category, backgroundVideoUrl, introVideoUrl, transitionVideoUrl, effectLayerUrl, effectLayerBlendMode, effectLayerOpacity, musicUrl, introFrameUrl, transitionFrameUrl, detailFrameUrl FROM Template WHERE isActive = 1 AND id IN ($placeholders)");
        $stmt->execute($selectedIds);
        $fetched = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $byId = [];
        foreach ($fetched as $template) {
            $byId[$template['id']] = $template;
        }
        $templates = [];
        foreach ($selectedIds as $id) {
            if (isset($byId[$id])) {
                $templates[] = $byId[$id];
            }
        }
    } else if ($settings && $settings['landingTemplateIds'] === '[]') {
        $templates = [];
    } else {
        $stmt = $pdo->query("SELECT id, name, description, previewUrl, codeKey, category, backgroundVideoUrl, introVideoUrl, transitionVideoUrl, effectLayerUrl, effectLayerBlendMode, effectLayerOpacity, musicUrl, introFrameUrl, transitionFrameUrl, detailFrameUrl FROM Template WHERE isActive = 1 ORDER BY createdAt DESC");
        $templates = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode(['success' => true, 'templates' => $templates]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error']);
}
?>
