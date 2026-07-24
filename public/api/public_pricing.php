<?php
require_once 'cors.php';
require_once 'db.php';

// Public endpoint — no auth required
try {
    $stmt = $pdo->query("SELECT pricingPlans FROM AppSettings LIMIT 1");
    $row = $stmt->fetch();
    $plans = [];
    $showPricing = true;
    if ($row && !empty($row['pricingPlans'])) {
        $data = json_decode($row['pricingPlans'], true) ?? [];
        if (isset($data['plans'])) {
            // New format: { plans: [...], showPricing: bool }
            $showPricing = $data['showPricing'] ?? true;
            $rawPlans = $data['plans'] ?? [];
        } else {
            // Legacy format: just an array
            $rawPlans = $data;
        }
        // Only return active plans
        $plans = array_values(array_filter($rawPlans, fn($p) => !isset($p['isActive']) || $p['isActive']));
    }
    echo json_encode(['success' => true, 'plans' => $plans, 'showPricing' => $showPricing]);
} catch (PDOException $e) {
    // Column may not exist yet — return empty gracefully
    echo json_encode(['success' => true, 'plans' => [], 'showPricing' => true]);
}
?>