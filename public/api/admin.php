<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';

$user = null;
$token = JWT::getBearerToken();

// Internal seed bypass — allows server-side seeding without a JWT token
$seedSecret = $_SERVER['HTTP_X_SEED_SECRET'] ?? '';
$isSeedRequest = ($seedSecret === 'ketteyos2024'
    && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST'
    && ($_GET['action'] ?? '') === 'pricing');

if (!$isSeedRequest) {
    try {
        if ($token) {
            $user = JWT::decode($token);
        }
    } catch (Exception $e) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit;
    }

    if (!$user || !in_array($user['role'], ['ADMIN', 'SUPER_ADMIN'])) {
        http_response_code(403);
        echo json_encode(['error' => 'Access Denied: Admin Only']);
        exit;
    }
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

function ensureGlobalAssetDriveSchema(PDO $pdo): void
{
    static $ensured = false;
    if ($ensured) {
        return;
    }

    try {
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `GlobalAssetFolder` (
                `id` varchar(191) NOT NULL,
                `name` varchar(191) NOT NULL,
                `parentId` varchar(191) DEFAULT NULL,
                `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                PRIMARY KEY (`id`),
                KEY `GlobalAssetFolder_parentId_idx` (`parentId`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
    } catch (Exception $e) {
        error_log('Failed to ensure GlobalAssetFolder table: ' . $e->getMessage());
    }

    try {
        $stmt = $pdo->query("SHOW COLUMNS FROM GlobalAsset LIKE 'folderId'");
        $column = $stmt->fetch();
        if (!$column) {
            $pdo->exec("ALTER TABLE GlobalAsset ADD COLUMN folderId varchar(191) NULL");
            try {
                $pdo->exec("ALTER TABLE GlobalAsset ADD INDEX GlobalAsset_folderId_idx (folderId)");
            } catch (Exception $indexError) {
                // Ignore duplicate index failures
            }
        }
    } catch (Exception $e) {
        error_log('Failed to ensure GlobalAsset.folderId column: ' . $e->getMessage());
    }

    $ensured = true;
}

if (in_array($action, ['assets', 'asset', 'asset-folder'], true)) {
    ensureGlobalAssetDriveSchema($pdo);
}

// GET Requests
if ($method === 'GET') {
    if ($action === 'stats') {
        try {
            $stmtUser = $pdo->query("SELECT COUNT(*) as count FROM User WHERE role = 'CLIENT'");
            $userCount = $stmtUser->fetch()['count'];
            $stmtEvent = $pdo->query("SELECT COUNT(*) as count FROM Event");
            $eventCount = $stmtEvent->fetch()['count'];
            $stmtAsset = $pdo->query("SELECT COUNT(*) as count FROM GlobalAsset");
            $assetCount = $stmtAsset->fetch()['count'];
            $stmtRecent = $pdo->query("SELECT e.id, e.title, e.date, u.name as userName, u.email as userEmail FROM Event e JOIN User u ON e.userId = u.id ORDER BY e.createdAt DESC LIMIT 5");
            $recentEvents = $stmtRecent->fetchAll();

            // Check Database Connection (implicitly done by queries, but explicit for health)
            $dbStatus = 'Connected';

            // Mock Storage Status (or check specific path if needed)
            $storageStatus = 'Optimal';

            // Calculate Event Growth (Current Month vs Last Month)
            $growth = ['rate' => 0, 'label' => 'Monthly Event Growth', 'trend' => 'flat'];
            try {
                $currentMonthStart = date('Y-m-01');
                $lastMonthStart = date('Y-m-01', strtotime('-1 month'));
                $lastMonthEnd = date('Y-m-t', strtotime('-1 month'));

                // Count Current Month
                $stmtCurrent = $pdo->prepare("SELECT COUNT(*) as count FROM Event WHERE createdAt >= :start");
                $stmtCurrent->execute(['start' => $currentMonthStart]);
                $currentMonthCount = $stmtCurrent->fetch()['count'];

                // Count Last Month
                $stmtLast = $pdo->prepare("SELECT COUNT(*) as count FROM Event WHERE createdAt >= :start AND createdAt <= :end");
                $stmtLast->execute(['start' => $lastMonthStart, 'end' => $lastMonthEnd]);
                $lastMonthCount = $stmtLast->fetch()['count'];

                // Calculate Percentage
                $growthRate = 0;
                if ($lastMonthCount > 0) {
                    $growthRate = (($currentMonthCount - $lastMonthCount) / $lastMonthCount) * 100;
                } else {
                    $growthRate = $currentMonthCount > 0 ? 100 : 0;
                }

                $growth = [
                    'rate' => round($growthRate, 1),
                    'label' => 'Monthly Event Growth',
                    'trend' => $growthRate >= 0 ? 'up' : 'down'
                ];
            } catch (Exception $e) {
                // Keep default growth
            }

            echo json_encode([
                'success' => true,
                'stats' => ['users' => $userCount, 'events' => $eventCount, 'assets' => $assetCount],
                'recentEvents' => $recentEvents,
                'health' => [
                    'database' => $dbStatus,
                    'storage' => $storageStatus
                ],
                'growth' => $growth
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'clients') {
        try {
            $cols = "u.id, u.name, u.email, u.phoneNumber, u.telegram, u.createdAt, u.role, u.status, u.planId, (SELECT COUNT(*) FROM Event e WHERE e.userId = u.id) as eventCount";
            try {
                $stmt = $pdo->query("SELECT $cols FROM User u WHERE u.role = 'CLIENT' ORDER BY u.createdAt DESC");
            } catch (PDOException $e) {
                $cols = "u.id, u.name, u.email, u.phoneNumber, u.telegram, u.createdAt, u.role, u.status, (SELECT COUNT(*) FROM Event e WHERE e.userId = u.id) as eventCount";
                $stmt = $pdo->query("SELECT $cols FROM User u WHERE u.role = 'CLIENT' ORDER BY u.createdAt DESC");
            }
            echo json_encode(['success' => true, 'clients' => $stmt->fetchAll()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'admins') {
        try {
            $stmt = $pdo->query("SELECT id, name, email, role, isSuperAdmin, createdAt FROM User WHERE role IN ('ADMIN', 'SUPER_ADMIN') ORDER BY createdAt DESC");
            echo json_encode(['success' => true, 'admins' => $stmt->fetchAll()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'templates') {
        try {
            $stmt = $pdo->query("SELECT * FROM Template ORDER BY createdAt DESC");
            echo json_encode(['success' => true, 'templates' => $stmt->fetchAll()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'assets') {
        try {
            $stmt = $pdo->query("SELECT * FROM GlobalAsset ORDER BY createdAt DESC");
            $stmtFolders = $pdo->query("SELECT * FROM GlobalAssetFolder ORDER BY name ASC, createdAt ASC");
            echo json_encode(['success' => true, 'assets' => $stmt->fetchAll(), 'folders' => $stmtFolders->fetchAll()]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'settings') {
        try {
            $stmt = $pdo->query("SELECT * FROM AppSettings LIMIT 1");
            $settings = $stmt->fetch();
            if (!$settings)
                $settings = ['appName' => 'KETTEKYUOS', 'appLogo' => null];
            echo json_encode(['success' => true, 'settings' => $settings]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'landing_showcase_options') {
        try {
            $templateStmt = $pdo->query("SELECT id, name, category, previewUrl, isActive, codeKey FROM Template WHERE isActive = 1 ORDER BY createdAt DESC");
            $eventStmt = $pdo->query("SELECT id, title, slug, shareImageUrl, templateId, date FROM Event ORDER BY createdAt DESC");
            echo json_encode([
                'success' => true,
                'templates' => $templateStmt->fetchAll(),
                'events' => $eventStmt->fetchAll(),
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'pricing') {
        try {
            $stmt = $pdo->query("SELECT pricingPlans FROM AppSettings LIMIT 1");
            $row = $stmt->fetch();
            $plans = [];
            $showPricing = true;
            if ($row && !empty($row['pricingPlans'])) {
                $data = json_decode($row['pricingPlans'], true) ?? [];
                // Support both legacy array format and new object format
                if (isset($data['plans'])) {
                    $plans = $data['plans'] ?? [];
                    $showPricing = $data['showPricing'] ?? true;
                } else {
                    $plans = $data; // legacy: was just an array
                }
            }
            echo json_encode(['success' => true, 'plans' => $plans, 'showPricing' => $showPricing]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Database error',
                'message' => 'Pricing settings are not available until the AppSettings schema is updated.'
            ]);
        }
    }
}

// POST Requests
else if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    // Create/Update Client or Admin
    if ($action === 'client' || $action === 'user') {
        $id = $input['id'] ?? null;
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $phoneNumber = $input['phoneNumber'] ?? '';
        $telegram = $input['telegram'] ?? '';
        $role = $input['role'] ?? 'CLIENT'; // CLIENT, ADMIN, SUPER_ADMIN
        $isSuperAdmin = $input['isSuperAdmin'] ?? 0;
        $planId = $input['planId'] ?? null; // null/empty = no plan; only used when key present for update
        $status = $input['status'] ?? null; // Allow status update for admin control

        if (!$email || (!$id && !$password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Name, Email and Password required']);
            exit;
        }

        try {
            if ($id) {
                // Update - Email update excluded as per request
                $updateFields = ['name', 'phoneNumber', 'telegram', 'role', 'isSuperAdmin'];
                $updateParams = ['name' => $name, 'phoneNumber' => $phoneNumber, 'telegram' => $telegram, 'role' => $role, 'isSuperAdmin' => $isSuperAdmin, 'id' => $id];
                if ($password) {
                    $updateFields[] = 'password';
                    $updateParams['password'] = password_hash($password, PASSWORD_DEFAULT);
                }
                // planId: empty string = clear, valid id = set, omit from input = no change
                if (array_key_exists('planId', $input)) {
                    $updateFields[] = 'planId';
                    $updateParams['planId'] = (!empty($planId)) ? $planId : null;
                }
                // status: only update if explicitly provided
                if ($status !== null) {
                    $updateFields[] = 'status';
                    $updateParams['status'] = $status;
                }
                $setClause = implode(', ', array_map(fn($f) => "$f = :$f", $updateFields));
                try {
                    $stmt = $pdo->prepare("UPDATE User SET $setClause WHERE id = :id");
                    $stmt->execute($updateParams);
                } catch (PDOException $e) {
                    // Older databases may not have the planId column yet.
                    if (strpos($e->getMessage(), 'planId') !== false && array_key_exists('planId', $updateParams)) {
                        $fallbackFields = array_values(array_filter($updateFields, fn($f) => $f !== 'planId'));
                        $fallbackParams = $updateParams;
                        unset($fallbackParams['planId']);

                        $fallbackClause = implode(', ', array_map(fn($f) => "$f = :$f", $fallbackFields));
                        $stmt = $pdo->prepare("UPDATE User SET $fallbackClause WHERE id = :id");
                        $stmt->execute($fallbackParams);
                    } else {
                        throw $e;
                    }
                }
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                // Create
                $check = $pdo->prepare("SELECT id FROM User WHERE email = :email");
                $check->execute(['email' => $email]);
                if ($check->fetch()) {
                    http_response_code(400);
                    echo json_encode(['error' => 'Email already exists']);
                    exit;
                }

                $newId = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));

                $hashed = password_hash($password, PASSWORD_DEFAULT);
                try {
                    $stmt = $pdo->prepare("INSERT INTO User (id, name, email, password, phoneNumber, telegram, role, isSuperAdmin, planId) VALUES (:id, :name, :email, :password, :phoneNumber, :telegram, :role, :isSuperAdmin, :planId)");
                    $stmt->execute(['id' => $newId, 'name' => $name, 'email' => $email, 'password' => $hashed, 'phoneNumber' => $phoneNumber, 'telegram' => $telegram, 'role' => $role, 'isSuperAdmin' => $isSuperAdmin, 'planId' => $planId]);
                } catch (PDOException $e) {
                    if (strpos($e->getMessage(), 'planId') !== false) {
                        $stmt = $pdo->prepare("INSERT INTO User (id, name, email, password, phoneNumber, telegram, role, isSuperAdmin) VALUES (:id, :name, :email, :password, :phoneNumber, :telegram, :role, :isSuperAdmin)");
                        $stmt->execute(['id' => $newId, 'name' => $name, 'email' => $email, 'password' => $hashed, 'phoneNumber' => $phoneNumber, 'telegram' => $telegram, 'role' => $role, 'isSuperAdmin' => $isSuperAdmin]);
                    } else {
                        throw $e;
                    }
                }
                echo json_encode(['success' => true, 'id' => $newId]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
    }

    // Approve User
    else if ($action === 'approve_user') {
        $id = $input['id'] ?? null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID required']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE User SET status = 'APPROVED' WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
    }

    // Update User Status
    else if ($action === 'user_status') {
        $id = $input['id'] ?? null;
        $status = $input['status'] ?? null;

        if (!$id || !$status) {
            http_response_code(400);
            echo json_encode(['error' => 'User ID and status are required']);
            exit;
        }

        // Validate status values
        $validStatuses = ['APPROVED', 'ACTIVE', 'INACTIVE', 'SUSPENDED'];
        if (!in_array($status, $validStatuses)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid status. Must be one of: ' . implode(', ', $validStatuses)]);
            exit;
        }

        try {
            $stmt = $pdo->prepare("UPDATE User SET status = :status WHERE id = :id");
            $stmt->execute(['status' => $status, 'id' => $id]);
            echo json_encode(['success' => true, 'message' => "User status updated to $status"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
    }

    // Create/Update Asset
    else if ($action === 'asset') {
        $id = $input['id'] ?? null;
        $name = $input['name'] ?? 'Untitled';
        $type = $input['type'] ?? 'IMAGE';
        $url = $input['url'] ?? '';
        $folderId = $input['folderId'] ?? null;

        if (!$url) {
            http_response_code(400);
            echo json_encode(['error' => 'Asset URL is required']);
            exit;
        }

        try {
            if ($id) {
                $stmt = $pdo->prepare("UPDATE GlobalAsset SET name = :name, type = :type, url = :url, folderId = :folderId WHERE id = :id");
                $stmt->execute(['name' => $name, 'type' => $type, 'url' => $url, 'folderId' => !empty($folderId) ? $folderId : null, 'id' => $id]);
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                $newId = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
                $stmt = $pdo->prepare("INSERT INTO GlobalAsset (id, name, type, url, folderId) VALUES (:id, :name, :type, :url, :folderId)");
                $stmt->execute(['id' => $newId, 'name' => $name, 'type' => $type, 'url' => $url, 'folderId' => !empty($folderId) ? $folderId : null]);
                echo json_encode(['success' => true, 'id' => $newId]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    }

    else if ($action === 'asset-folder') {
        $id = $input['id'] ?? null;
        $name = trim($input['name'] ?? '');
        $parentId = $input['parentId'] ?? null;

        if ($name === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Folder name is required']);
            exit;
        }

        try {
            if ($id) {
                $stmt = $pdo->prepare("UPDATE GlobalAssetFolder SET name = :name, parentId = :parentId WHERE id = :id");
                $stmt->execute([
                    'id' => $id,
                    'name' => $name,
                    'parentId' => !empty($parentId) ? $parentId : null,
                ]);
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                $newId = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
                $stmt = $pdo->prepare("INSERT INTO GlobalAssetFolder (id, name, parentId) VALUES (:id, :name, :parentId)");
                $stmt->execute([
                    'id' => $newId,
                    'name' => $name,
                    'parentId' => !empty($parentId) ? $parentId : null,
                ]);
                echo json_encode(['success' => true, 'id' => $newId]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    }

    // Create/Update Template
    else if ($action === 'template') {
        $id = $input['id'] ?? null;
        $name = $input['name'] ?? '';
        $codeKey = $input['codeKey'] ?? '';
        $category = $input['category'] ?? 'Wedding';
        $introVideoUrl = isset($input['introVideoUrl']) ? trim($input['introVideoUrl']) : null;
        $transitionVideoUrl = isset($input['transitionVideoUrl']) ? trim($input['transitionVideoUrl']) : null;
        $backgroundVideoUrl = isset($input['backgroundVideoUrl']) ? trim($input['backgroundVideoUrl']) : null;
        $backgroundImageUrl = isset($input['backgroundImageUrl']) ? trim($input['backgroundImageUrl']) : null;
        $musicUrl = isset($input['musicUrl']) ? trim($input['musicUrl']) : null;
        $effectLayerUrl = isset($input['effectLayerUrl']) ? trim($input['effectLayerUrl']) : null;
        $effectLayerOpacity = $input['effectLayerOpacity'] ?? 1.0;
        $effectLayerBlendMode = $input['effectLayerBlendMode'] ?? 'screen';
        $previewUrl = $input['previewUrl'] ?? '';
        $isActive = $input['isActive'] ?? 1;

        $introFrameUrl = isset($input['introFrameUrl']) ? trim($input['introFrameUrl']) : null;
        $transitionFrameUrl = isset($input['transitionFrameUrl']) ? trim($input['transitionFrameUrl']) : null;
        $detailFrameUrl = isset($input['detailFrameUrl']) ? trim($input['detailFrameUrl']) : null;
        $buttonImageUrl = isset($input['buttonImageUrl']) ? trim($input['buttonImageUrl']) : null;
        $guestFrameUrl = isset($input['guestFrameUrl']) ? trim($input['guestFrameUrl']) : null;
        $templateConfig = isset($input['templateConfig']) ? $input['templateConfig'] : null;

        if (!$name || !$codeKey) {
            http_response_code(400);
            echo json_encode(['error' => 'Name and Code Key required']);
            exit;
        }

        try {
            if ($id) {
                $stmt = $pdo->prepare("UPDATE Template SET name = :name, codeKey = :codeKey, category = :category, previewUrl = :previewUrl, isActive = :isActive, introVideoUrl = :intro, transitionVideoUrl = :trans, backgroundVideoUrl = :bg, backgroundImageUrl = :bgImg, musicUrl = :music, effectLayerUrl = :effUrl, effectLayerOpacity = :effOp, effectLayerBlendMode = :effBlend, introFrameUrl = :introFrame, transitionFrameUrl = :transFrame, detailFrameUrl = :detailFrame, buttonImageUrl = :btnImg, guestFrameUrl = :gstFrame, templateConfig = :templateConfig WHERE id = :id");
                $stmt->execute([
                    'name' => $name,
                    'codeKey' => $codeKey,
                    'category' => $category,
                    'previewUrl' => $previewUrl,
                    'isActive' => $isActive,
                    'intro' => $introVideoUrl,
                    'trans' => $transitionVideoUrl,
                    'bg' => $backgroundVideoUrl,
                    'bgImg' => $backgroundImageUrl,
                    'music' => $musicUrl,
                    'effUrl' => $effectLayerUrl,
                    'effOp' => $effectLayerOpacity,
                    'effBlend' => $effectLayerBlendMode,
                    'introFrame' => $introFrameUrl,
                    'transFrame' => $transitionFrameUrl,
                    'detailFrame' => $detailFrameUrl,
                    'btnImg' => $buttonImageUrl,
                    'gstFrame' => $guestFrameUrl,
                    'templateConfig' => $templateConfig,
                    'id' => $id
                ]);
                echo json_encode(['success' => true, 'id' => $id]);
            } else {
                $newId = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
                $stmt = $pdo->prepare("INSERT INTO Template (id, name, codeKey, category, previewUrl, isActive, introVideoUrl, transitionVideoUrl, backgroundVideoUrl, backgroundImageUrl, musicUrl, effectLayerUrl, effectLayerOpacity, effectLayerBlendMode, introFrameUrl, transitionFrameUrl, detailFrameUrl, buttonImageUrl, guestFrameUrl, templateConfig) VALUES (:id, :name, :codeKey, :category, :previewUrl, :isActive, :intro, :trans, :bg, :bgImg, :music, :effUrl, :effOp, :effBlend, :introFrame, :transFrame, :detailFrame, :btnImg, :gstFrame, :templateConfig)");
                $stmt->execute([
                    'id' => $newId,
                    'name' => $name,
                    'codeKey' => $codeKey,
                    'category' => $category,
                    'previewUrl' => $previewUrl,
                    'isActive' => $isActive,
                    'intro' => $introVideoUrl,
                    'trans' => $transitionVideoUrl,
                    'bg' => $backgroundVideoUrl,
                    'bgImg' => $backgroundImageUrl,
                    'music' => $musicUrl,
                    'effUrl' => $effectLayerUrl,
                    'effOp' => $effectLayerOpacity,
                    'effBlend' => $effectLayerBlendMode,
                    'introFrame' => $introFrameUrl,
                    'transFrame' => $transitionFrameUrl,
                    'detailFrame' => $detailFrameUrl,
                    'btnImg' => $buttonImageUrl,
                    'gstFrame' => $guestFrameUrl,
                    'templateConfig' => $templateConfig,
                ]);
                echo json_encode(['success' => true, 'id' => $newId]);
            }
        } catch (PDOException $e) {
            // Attempt to recover from missing column errors
            $msg = $e->getMessage();
            if (strpos($msg, 'Unknown column') !== false) {
                $columnsToAdd = [
                    'musicUrl' => 'TEXT',
                    'effectLayerUrl' => 'TEXT',
                    'introFrameUrl' => 'TEXT',
                    'transitionFrameUrl' => 'TEXT',
                    'detailFrameUrl' => 'TEXT',
                    'buttonImageUrl' => 'TEXT',
                    'guestFrameUrl' => 'TEXT',
                    'templateConfig' => 'LONGTEXT',
                    'backgroundImageUrl' => 'TEXT'
                ];

                foreach ($columnsToAdd as $col => $type) {
                    try {
                        $pdo->exec("ALTER TABLE Template ADD COLUMN $col $type");
                    } catch (Exception $ex) {
                        // Column likely exists or other error, continue to next
                    }
                }

                try {
                    // Retry
                    if ($id) {
                        $stmt = $pdo->prepare("UPDATE Template SET name = :name, codeKey = :codeKey, category = :category, previewUrl = :previewUrl, isActive = :isActive, introVideoUrl = :intro, transitionVideoUrl = :trans, backgroundVideoUrl = :bg, musicUrl = :music, effectLayerUrl = :effUrl, effectLayerOpacity = :effOp, effectLayerBlendMode = :effBlend, introFrameUrl = :introFrame, transitionFrameUrl = :transFrame, detailFrameUrl = :detailFrame, buttonImageUrl = :btnImg, guestFrameUrl = :gstFrame, templateConfig = :templateConfig WHERE id = :id");
                        $stmt->execute([
                            'name' => $name,
                            'codeKey' => $codeKey,
                            'category' => $category,
                            'previewUrl' => $previewUrl,
                            'isActive' => $isActive,
                            'intro' => $introVideoUrl,
                            'trans' => $transitionVideoUrl,
                            'bg' => $backgroundVideoUrl,
                            'music' => $musicUrl,
                            'effUrl' => $effectLayerUrl,
                            'effOp' => $effectLayerOpacity,
                            'effBlend' => $effectLayerBlendMode,
                            'introFrame' => $introFrameUrl,
                            'transFrame' => $transitionFrameUrl,
                            'detailFrame' => $detailFrameUrl,
                            'btnImg' => $buttonImageUrl,
                            'gstFrame' => $guestFrameUrl,
                            'templateConfig' => $templateConfig,
                            'id' => $id
                        ]);
                        echo json_encode(['success' => true, 'id' => $id]);
                    } else {
                        $stmt = $pdo->prepare("INSERT INTO Template (id, name, codeKey, category, previewUrl, isActive, introVideoUrl, transitionVideoUrl, backgroundVideoUrl, musicUrl, effectLayerUrl, effectLayerOpacity, effectLayerBlendMode, introFrameUrl, transitionFrameUrl, detailFrameUrl, buttonImageUrl, guestFrameUrl, templateConfig) VALUES (:id, :name, :codeKey, :category, :previewUrl, :isActive, :intro, :trans, :bg, :music, :effUrl, :effOp, :effBlend, :introFrame, :transFrame, :detailFrame, :btnImg, :gstFrame, :templateConfig)");
                        $stmt->execute([
                            'id' => $newId,
                            'name' => $name,
                            'codeKey' => $codeKey,
                            'category' => $category,
                            'previewUrl' => $previewUrl,
                            'isActive' => $isActive,
                            'intro' => $introVideoUrl,
                            'trans' => $transitionVideoUrl,
                            'bg' => $backgroundVideoUrl,
                            'music' => $musicUrl,
                            'effUrl' => $effectLayerUrl,
                            'effOp' => $effectLayerOpacity,
                            'effBlend' => $effectLayerBlendMode,
                            'introFrame' => $introFrameUrl,
                            'transFrame' => $transitionFrameUrl,
                            'detailFrame' => $detailFrameUrl,
                            'btnImg' => $buttonImageUrl,
                            'gstFrame' => $guestFrameUrl,
                            'templateConfig' => $templateConfig,
                        ]);
                        echo json_encode(['success' => true, 'id' => $newId]);
                    }
                    return;
                } catch (Exception $ex) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Retry failed: ' . $ex->getMessage()]);
                    return;
                }
            }
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }

    }

    // Update Settings
    else if ($action === 'settings') {
        $appName = $input['appName'] ?? 'KETTEKYUOS';
        $appLogo = $input['appLogo'] ?? null;
        $appLogoDark = $input['appLogoDark'] ?? null;
        $favicon = $input['favicon'] ?? null;

        $mobileAppLogo = $input['mobileAppLogo'] ?? null;
        $mobileAppLogoDark = $input['mobileAppLogoDark'] ?? null;

        // Social Media Links
        $facebookUrl = isset($input['facebookUrl']) ? trim($input['facebookUrl']) : null;
        $tiktokUrl = isset($input['tiktokUrl']) ? trim($input['tiktokUrl']) : null;
        $youtubeUrl = isset($input['youtubeUrl']) ? trim($input['youtubeUrl']) : null;
        $telegramUrl = isset($input['telegramUrl']) ? trim($input['telegramUrl']) : null;

        // Contact Information
        $contactEmail = isset($input['contactEmail']) ? trim($input['contactEmail']) : null;
        $contactPhone = isset($input['contactPhone']) ? trim($input['contactPhone']) : null;
        $contactTelegram = isset($input['contactTelegram']) ? trim($input['contactTelegram']) : null;
        $contactWhatsApp = isset($input['contactWhatsApp']) ? trim($input['contactWhatsApp']) : null;
        $contactWeChat = isset($input['contactWeChat']) ? trim($input['contactWeChat']) : null;

        // Telegram Notification Settings
        $telegramBotToken = isset($input['telegramBotToken']) ? trim($input['telegramBotToken']) : null;
        $telegramChatId = isset($input['telegramChatId']) ? trim($input['telegramChatId']) : null;
        $googleAnalyticsId = isset($input['googleAnalyticsId']) ? trim($input['googleAnalyticsId']) : null;

        // Bakong KHQR Payment Settings
        $bakongToken = isset($input['bakongToken']) ? trim($input['bakongToken']) : null;
        $bakongAccountId = isset($input['bakongAccountId']) ? trim($input['bakongAccountId']) : null;
        $bakongAccountName = isset($input['bakongAccountName']) ? trim($input['bakongAccountName']) : null;
        $bakongMerchantCity = isset($input['bakongMerchantCity']) ? trim($input['bakongMerchantCity']) : 'PHNOM PENH';
        $landingTemplateIds = array_key_exists('landingTemplateIds', $input)
            ? json_encode(array_values(array_filter((array) $input['landingTemplateIds'])))
            : null;
        $landingShowcaseEventIds = array_key_exists('landingShowcaseEventIds', $input)
            ? json_encode(array_values(array_filter((array) $input['landingShowcaseEventIds'])))
            : null;

        try {
            $stmt = $pdo->query("SELECT id FROM AppSettings LIMIT 1");
            $existing = $stmt->fetch();

            if ($existing) {
                // Update
                $update = $pdo->prepare("UPDATE AppSettings SET appName = :name, appLogo = :logo, appLogoDark = :logoDark, mobileAppLogo = :mobileLogo, mobileAppLogoDark = :mobileLogoDark, favicon = :favicon, facebookUrl = :fb, tiktokUrl = :tt, youtubeUrl = :yt, telegramUrl = :tg, contactEmail = :email, contactPhone = :phone, contactTelegram = :ctg, contactWhatsApp = :wa, contactWeChat = :wc, telegramBotToken = :botToken, telegramChatId = :chatId, googleAnalyticsId = :ga, bakongToken = :bkToken, bakongAccountId = :bkAccId, bakongAccountName = :bkAccName, bakongMerchantCity = :bkCity, landingTemplateIds = :landingTemplateIds, landingShowcaseEventIds = :landingShowcaseEventIds, updatedAt = NOW() WHERE id = :id");
                $update->execute([
                    'name' => $appName,
                    'logo' => $appLogo,
                    'logoDark' => $appLogoDark,
                    'mobileLogo' => $mobileAppLogo,
                    'mobileLogoDark' => $mobileAppLogoDark,
                    'favicon' => $favicon,
                    'fb' => $facebookUrl,
                    'tt' => $tiktokUrl,
                    'yt' => $youtubeUrl,
                    'tg' => $telegramUrl,
                    'email' => $contactEmail,
                    'phone' => $contactPhone,
                    'ctg' => $contactTelegram,
                    'wa' => $contactWhatsApp,
                    'wc' => $contactWeChat,
                    'botToken' => $telegramBotToken,
                    'chatId' => $telegramChatId,
                    'ga' => $googleAnalyticsId,
                    'bkToken' => $bakongToken,
                    'bkAccId' => $bakongAccountId,
                    'bkAccName' => $bakongAccountName,
                    'bkCity' => $bakongMerchantCity,
                    'landingTemplateIds' => $landingTemplateIds,
                    'landingShowcaseEventIds' => $landingShowcaseEventIds,
                    'id' => $existing['id']
                ]);
            } else {
                // Insert
                $id = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
                $insert = $pdo->prepare("INSERT INTO AppSettings (id, appName, appLogo, appLogoDark, mobileAppLogo, mobileAppLogoDark, favicon, facebookUrl, tiktokUrl, youtubeUrl, telegramUrl, contactEmail, contactPhone, contactTelegram, contactWhatsApp, contactWeChat, telegramBotToken, telegramChatId, googleAnalyticsId, bakongToken, bakongAccountId, bakongAccountName, bakongMerchantCity, landingTemplateIds, landingShowcaseEventIds) VALUES (:id, :name, :logo, :logoDark, :mobileLogo, :mobileLogoDark, :favicon, :fb, :tt, :yt, :tg, :email, :phone, :ctg, :wa, :wc, :botToken, :chatId, :ga, :bkToken, :bkAccId, :bkAccName, :bkCity, :landingTemplateIds, :landingShowcaseEventIds)");
                $insert->execute([
                    'id' => $id,
                    'name' => $appName,
                    'logo' => $appLogo,
                    'logoDark' => $appLogoDark,
                    'mobileLogo' => $mobileAppLogo,
                    'mobileLogoDark' => $mobileAppLogoDark,
                    'favicon' => $favicon,
                    'fb' => $facebookUrl,
                    'tt' => $tiktokUrl,
                    'yt' => $youtubeUrl,
                    'tg' => $telegramUrl,
                    'email' => $contactEmail,
                    'phone' => $contactPhone,
                    'ctg' => $contactTelegram,
                    'wa' => $contactWhatsApp,
                    'wc' => $contactWeChat,
                    'botToken' => $telegramBotToken,
                    'chatId' => $telegramChatId,
                    'ga' => $googleAnalyticsId,
                    'bkToken' => $bakongToken,
                    'bkAccId' => $bakongAccountId,
                    'bkAccName' => $bakongAccountName,
                    'bkCity' => $bakongMerchantCity,
                    'landingTemplateIds' => $landingTemplateIds,
                    'landingShowcaseEventIds' => $landingShowcaseEventIds,
                ]);
            }
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            // Attempt to add missing columns if error occurs
            $msg = $e->getMessage();
            if (strpos($msg, 'Unknown column') !== false) {
                try {
                    $columns = [
                        "facebookUrl TEXT NULL",
                        "tiktokUrl TEXT NULL",
                        "youtubeUrl TEXT NULL",
                        "telegramUrl TEXT NULL",
                        "contactEmail VARCHAR(191) NULL",
                        "contactPhone VARCHAR(191) NULL",
                        "contactTelegram VARCHAR(191) NULL",
                        "contactWhatsApp VARCHAR(191) NULL",
                        "contactWeChat VARCHAR(191) NULL",
                        "appLogoDark TEXT NULL",
                        "favicon TEXT NULL",
                        "mobileAppLogo TEXT NULL",
                        "mobileAppLogoDark TEXT NULL",
                        "telegramBotToken TEXT NULL",
                        "telegramChatId VARCHAR(191) NULL",
                        "bakongToken TEXT NULL",
                        "bakongAccountId VARCHAR(191) NULL",
                        "bakongAccountName VARCHAR(191) NULL",
                        "bakongMerchantCity VARCHAR(100) NULL",
                        "googleAnalyticsId VARCHAR(191) NULL",
                        "landingTemplateIds LONGTEXT NULL",
                        "landingShowcaseEventIds LONGTEXT NULL"
                    ];

                    foreach ($columns as $colDef) {
                        try {
                            $pdo->exec("ALTER TABLE AppSettings ADD COLUMN $colDef");
                        } catch (Exception $e) {
                            // Ignore if column exists
                        }
                    }

                    // Retry the operation
                    if ($existing) {
                        $update = $pdo->prepare("UPDATE AppSettings SET appName = :name, appLogo = :logo, appLogoDark = :logoDark, favicon = :favicon, mobileAppLogo = :mobileLogo, mobileAppLogoDark = :mobileLogoDark, facebookUrl = :fb, tiktokUrl = :tt, youtubeUrl = :yt, telegramUrl = :tg, contactEmail = :email, contactPhone = :phone, contactTelegram = :ctg, contactWhatsApp = :wa, contactWeChat = :wc, telegramBotToken = :botToken, telegramChatId = :chatId, googleAnalyticsId = :ga, bakongToken = :bkToken, bakongAccountId = :bkAccId, bakongAccountName = :bkAccName, bakongMerchantCity = :bkCity, landingTemplateIds = :landingTemplateIds, landingShowcaseEventIds = :landingShowcaseEventIds, updatedAt = NOW() WHERE id = :id");
                        $update->execute([
                            'name' => $appName,
                            'logo' => $appLogo,
                            'logoDark' => $appLogoDark,
                            'favicon' => $favicon,
                            'mobileLogo' => $mobileAppLogo,
                            'mobileLogoDark' => $mobileAppLogoDark,
                            'fb' => $facebookUrl,
                            'tt' => $tiktokUrl,
                            'yt' => $youtubeUrl,
                            'tg' => $telegramUrl,
                            'email' => $contactEmail,
                            'phone' => $contactPhone,
                            'ctg' => $contactTelegram,
                            'wa' => $contactWhatsApp,
                            'wc' => $contactWeChat,
                            'botToken' => $telegramBotToken,
                            'chatId' => $telegramChatId,
                            'ga' => $googleAnalyticsId,
                            'bkToken' => $bakongToken,
                            'bkAccId' => $bakongAccountId,
                            'bkAccName' => $bakongAccountName,
                            'bkCity' => $bakongMerchantCity,
                            'landingTemplateIds' => $landingTemplateIds,
                            'landingShowcaseEventIds' => $landingShowcaseEventIds,
                            'id' => $existing['id']
                        ]);
                    } else {
                        // Retry Insert
                        $insert = $pdo->prepare("INSERT INTO AppSettings (id, appName, appLogo, appLogoDark, mobileAppLogo, mobileAppLogoDark, favicon, facebookUrl, tiktokUrl, youtubeUrl, telegramUrl, contactEmail, contactPhone, contactTelegram, contactWhatsApp, contactWeChat, telegramBotToken, telegramChatId, googleAnalyticsId, bakongToken, bakongAccountId, bakongAccountName, bakongMerchantCity, landingTemplateIds, landingShowcaseEventIds) VALUES (:id, :name, :logo, :logoDark, :mobileLogo, :mobileLogoDark, :favicon, :fb, :tt, :yt, :tg, :email, :phone, :ctg, :wa, :wc, :botToken, :chatId, :ga, :bkToken, :bkAccId, :bkAccName, :bkCity, :landingTemplateIds, :landingShowcaseEventIds)");
                        $insert->execute([
                            'id' => $id,
                            'name' => $appName,
                            'logo' => $appLogo,
                            'logoDark' => $appLogoDark,
                            'mobileLogo' => $mobileAppLogo,
                            'mobileLogoDark' => $mobileAppLogoDark,
                            'favicon' => $favicon,
                            'fb' => $facebookUrl,
                            'tt' => $tiktokUrl,
                            'yt' => $youtubeUrl,
                            'tg' => $telegramUrl,
                            'email' => $contactEmail,
                            'phone' => $contactPhone,
                            'ctg' => $contactTelegram,
                            'wa' => $contactWhatsApp,
                            'wc' => $contactWeChat,
                            'botToken' => $telegramBotToken,
                            'chatId' => $telegramChatId,
                            'ga' => $googleAnalyticsId,
                            'bkToken' => $bakongToken,
                            'bkAccId' => $bakongAccountId,
                            'bkAccName' => $bakongAccountName,
                            'bkCity' => $bakongMerchantCity,
                            'landingTemplateIds' => $landingTemplateIds,
                            'landingShowcaseEventIds' => $landingShowcaseEventIds,
                        ]);
                    }
                    echo json_encode(['success' => true]);
                    return;
                } catch (Exception $ex) {
                    file_put_contents('error_log.txt', date('[Y-m-d H:i:s] ') . "Retry failed: " . $ex->getMessage() . "\n", FILE_APPEND);
                    http_response_code(500);
                    echo json_encode(['error' => 'Retry failed: ' . $ex->getMessage()]);
                    return;
                }
            }
            file_put_contents('error_log.txt', date('[Y-m-d H:i:s] ') . "Database error: " . $e->getMessage() . "\n", FILE_APPEND);
            http_response_code(500);
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
    }

    // Save Pricing Plans
    else if ($action === 'pricing') {
        $plans = $input['plans'] ?? [];
        $showPricing = isset($input['showPricing']) ? (bool) $input['showPricing'] : true;
        $payload = ['plans' => $plans, 'showPricing' => $showPricing];
        $plansJson = json_encode($payload);

        try {
            $stmt = $pdo->query("SELECT id FROM AppSettings LIMIT 1");
            $existing = $stmt->fetch();

            if ($existing) {
                $update = $pdo->prepare("UPDATE AppSettings SET pricingPlans = :plans, updatedAt = NOW() WHERE id = :id");
                $update->execute(['plans' => $plansJson, 'id' => $existing['id']]);
            } else {
                $newId = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));
                $insert = $pdo->prepare("INSERT INTO AppSettings (id, pricingPlans) VALUES (:id, :plans)");
                $insert->execute(['id' => $newId, 'plans' => $plansJson]);
            }
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                'error' => 'Database error',
                'message' => 'Pricing plans could not be saved. Please update the database schema first.'
            ]);
        }
    }
}

// DELETE Requests
else if ($method === 'DELETE') {
    $id = $_GET['id'] ?? '';
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID required']);
        exit;
    }

    if ($action === 'user') {
        if ($id === $user['userId']) {
            http_response_code(400);
            echo json_encode(['error' => 'Cannot delete yourself']);
            exit;
        }
        try {
            $stmt = $pdo->prepare("DELETE FROM User WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'asset') {
        try {
            $stmt = $pdo->prepare("DELETE FROM GlobalAsset WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'asset-folder') {
        try {
            $stmtAssets = $pdo->prepare("SELECT COUNT(*) as count FROM GlobalAsset WHERE folderId = :id");
            $stmtAssets->execute(['id' => $id]);
            $assetCount = (int) ($stmtAssets->fetch()['count'] ?? 0);

            $stmtFolders = $pdo->prepare("SELECT COUNT(*) as count FROM GlobalAssetFolder WHERE parentId = :id");
            $stmtFolders->execute(['id' => $id]);
            $folderCount = (int) ($stmtFolders->fetch()['count'] ?? 0);

            if ($assetCount > 0 || $folderCount > 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Folder is not empty']);
                exit;
            }

            $stmt = $pdo->prepare("DELETE FROM GlobalAssetFolder WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    } else if ($action === 'template') {
        try {
            $stmt = $pdo->prepare("DELETE FROM Template WHERE id = :id");
            $stmt->execute(['id' => $id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error']);
        }
    }
}
?>
