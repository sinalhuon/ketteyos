<?php
/**
 * Plan Limits Helper
 * Returns plan limits for a given planId from AppSettings pricingPlans.
 * Used to enforce feature restrictions per subscription plan.
 * maxEvents / maxPhotos of -1 means unlimited.
 */
require_once __DIR__ . '/db.php';

// Default limits when no plan or plan not found (most restrictive)
function getDefaultLimits() {
    return [
        'maxEvents' => 1,
        'maxPhotos' => 5,
        'maxLanguages' => 1,
        'smartRsvp' => false,
        'digitalWishes' => false,
        'customMusic' => false,
        'embedVideo' => false,
        'premiumAnimations' => false,
        'addToCalendar' => false,
        'customDesign' => false,
        'customDomain' => false,
        'qrCheckin' => false,
        'vipSupport' => false,
    ];
}

/** -1 means unlimited */
function isUnlimited($value): bool {
    return $value === -1 || $value === 9999 || $value === 999;
}

/**
 * Get plan limits for a plan ID.
 * @param PDO $pdo Database connection
 * @param string|null $planId Plan ID from User.planId
 * @return array Associative array of limits
 */
function getPlanLimits($pdo, $planId) {
    $default = getDefaultLimits();
    if (empty($planId)) {
        return $default;
    }

    try {
        $stmt = $pdo->query("SELECT pricingPlans FROM AppSettings LIMIT 1");
        $row = $stmt->fetch();
        if (!$row || empty($row['pricingPlans'])) {
            return $default;
        }

        $data = json_decode($row['pricingPlans'], true);
        $plans = $data['plans'] ?? (is_array($data) ? $data : []);
        foreach ($plans as $plan) {
            if (($plan['id'] ?? '') === $planId) {
                $limits = $plan['limits'] ?? [];
                return array_merge($default, $limits);
            }
        }
    } catch (Exception $e) {
        error_log('getPlanLimits error: ' . $e->getMessage());
    }
    return $default;
}

/**
 * Get plan limits for a user by userId (from JWT).
 * Admins get unlimited. Clients get their plan limits.
 */
function getUserPlanLimits($pdo, $userId, $role = null, $isSuperAdmin = false) {
    if ((!$role && !$isSuperAdmin) && !empty($userId)) {
        try {
            $stmtUser = $pdo->prepare("SELECT role, isSuperAdmin FROM User WHERE id = :id LIMIT 1");
            $stmtUser->execute(['id' => $userId]);
            $userRow = $stmtUser->fetch();
            if ($userRow) {
                $role = $userRow['role'] ?? $role;
                $isSuperAdmin = !empty($userRow['isSuperAdmin']);
            }
        } catch (Exception $e) {
            error_log('getUserPlanLimits user role lookup error: ' . $e->getMessage());
        }
    }

    if (in_array($role, ['ADMIN', 'SUPER_ADMIN']) || $isSuperAdmin) {
        $l = getDefaultLimits();
        $l['maxEvents'] = -1;
        $l['maxPhotos'] = -1;
        $l['maxLanguages'] = 99;
        $l['smartRsvp'] = true;
        $l['digitalWishes'] = true;
        $l['customMusic'] = true;
        $l['embedVideo'] = true;
        $l['premiumAnimations'] = true;
        $l['addToCalendar'] = true;
        $l['customDesign'] = true;
        $l['customDomain'] = true;
        $l['qrCheckin'] = true;
        $l['vipSupport'] = true;
        return $l;
    }
    try {
        try {
            $stmt = $pdo->prepare("SELECT planId FROM User WHERE id = :id");
            $stmt->execute(['id' => $userId]);
            $row = $stmt->fetch();
            $planId = $row['planId'] ?? null;
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'planId') !== false) {
                return getDefaultLimits();
            }
            throw $e;
        }
        return getPlanLimits($pdo, $planId);
    } catch (Exception $e) {
        error_log('getUserPlanLimits error: ' . $e->getMessage());
        return getDefaultLimits();
    }
}

/**
 * Get plan by ID (full plan object).
 */
function getPlanById($pdo, $planId) {
    if (empty($planId)) return null;
    try {
        $stmt = $pdo->query("SELECT pricingPlans FROM AppSettings LIMIT 1");
        $row = $stmt->fetch();
        if (!$row || empty($row['pricingPlans'])) return null;
        $data = json_decode($row['pricingPlans'], true);
        $plans = $data['plans'] ?? (is_array($data) ? $data : []);
        foreach ($plans as $plan) {
            if (($plan['id'] ?? '') === $planId) return $plan;
        }
    } catch (Exception $e) {
        error_log('getPlanById error: ' . $e->getMessage());
    }
    return null;
}
