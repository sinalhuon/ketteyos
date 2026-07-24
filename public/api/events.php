<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';
require_once 'plan_limits.php';

// Set timezone to Cambodia
date_default_timezone_set('Asia/Phnom_Penh');

// Check Authorization
// Check Authorization
$token = JWT::getBearerToken();
$user = null;

if ($token) {
    try {
        $user = JWT::decode($token);
    } catch (Exception $e) {
        // Token invalid or expired
    }
}

$publicAccess = false;
if (!$user) {
    if (
        $_SERVER['REQUEST_METHOD'] === 'GET' &&
        (isset($_GET['slug']) || (isset($_GET['id']) && isset($_GET['public'])))
    ) {
        // Allow public access for viewing invitations by slug or public id
        $publicAccess = true;
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet($pdo, $user, $publicAccess);
        break;
    case 'POST':
        handlePost($pdo, $user);
        break;
    case 'PUT':
        handlePut($pdo, $user);
        break;
    case 'DELETE':
        handleDelete($pdo, $user);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function handleGet($pdo, $user, $publicAccess)
{
    $mergeTemplateConfigs = function ($templateConfig, $eventConfig) {
        $templateArray = [];
        $eventArray = [];
        $allowedEventOverrideKeys = [
            'showIntroGuestName',
            'showTransitionOverlay',
            'showTransitionSaveTheDate',
            'showTransitionEventTitle',
            'showTransitionNames',
            'showTransitionDate',
            'showTransitionLocation',
            'transitionDurationSeconds',
            'storySlides',
            'movieCredits',
            'movieTitle',
            'movieTitleEn',
            'movieSummary',
            'directorName',
            'directorNameEn',
            'productionLogoUrl',
            'mainSponsorLogos',
            'cooperateSponsorLogos',
            'movieTrailerUrl',
            'dressCode',
            'dressCodeText',
            'dressCodeColors',
        ];

        if (is_string($templateConfig) && $templateConfig !== '') {
            $decoded = json_decode($templateConfig, true);
            if (is_array($decoded)) {
                $templateArray = $decoded;
            }
        } elseif (is_array($templateConfig)) {
            $templateArray = $templateConfig;
        }

        if (is_string($eventConfig) && $eventConfig !== '') {
            $decoded = json_decode($eventConfig, true);
            if (is_array($decoded)) {
                $eventArray = array_intersect_key($decoded, array_flip($allowedEventOverrideKeys));
            }
        } elseif (is_array($eventConfig)) {
            $eventArray = array_intersect_key($eventConfig, array_flip($allowedEventOverrideKeys));
        }

        return json_encode(array_merge($templateArray, $eventArray));
    };

    if (isset($_GET['slug'])) {
        // Public Invitation View
        // Fetch Event AND Template details
        try {
            $stmt = $pdo->prepare("
                SELECT e.*,
                    e.templateConfig as eventTemplateConfig,
                    t.backgroundVideoUrl, t.introVideoUrl, t.transitionVideoUrl, t.effectLayerUrl, t.musicUrl, t.effectLayerOpacity, t.effectLayerBlendMode,
                    t.introFrameUrl as t_introFrameUrl, t.transitionFrameUrl as t_transitionFrameUrl, t.detailFrameUrl as t_detailFrameUrl,
                    t.templateConfig as baseTemplateConfig, t.backgroundImageUrl, t.buttonImageUrl, t.guestFrameUrl
                FROM Event e
                LEFT JOIN Template t ON e.templateId = t.codeKey
                WHERE e.slug = :slug
            ");
            $stmt->execute(['slug' => $_GET['slug']]);
            $event = $stmt->fetch();

            // Merge Template Frames if Event Frames are empty
            if ($event) {
                if (empty($event['introFrameUrl']))
                    $event['introFrameUrl'] = $event['t_introFrameUrl'];
                if (empty($event['transitionFrameUrl']))
                    $event['transitionFrameUrl'] = $event['t_transitionFrameUrl'];
                if (empty($event['detailFrameUrl']))
                    $event['detailFrameUrl'] = $event['t_detailFrameUrl'];
                $event['templateConfig'] = $mergeTemplateConfigs($event['baseTemplateConfig'] ?? null, $event['eventTemplateConfig'] ?? null);
            }
        } catch (Exception $e) {
            // Fallback if columns are missing or join fails
            $stmt = $pdo->prepare("SELECT * FROM Event WHERE slug = :slug");
            $stmt->execute(['slug' => $_GET['slug']]);
            $event = $stmt->fetch();
        }

        // If templateId didn't match codeKey, try matching id (fallback)
        // Or if the initial join failed to populate template fields
        if ($event && !isset($event['backgroundVideoUrl'])) {
            try {
                $stmt2 = $pdo->prepare("SELECT * FROM Template WHERE id = :tid OR codeKey = :tid");
                $stmt2->execute(['tid' => $event['templateId']]);
                $template = $stmt2->fetch();
                if ($template) {
                    $event['backgroundVideoUrl'] = $template['backgroundVideoUrl'] ?? null;
                    $event['introVideoUrl'] = $template['introVideoUrl'] ?? null;
                    $event['transitionVideoUrl'] = $template['transitionVideoUrl'] ?? null;
                    $event['effectLayerUrl'] = $template['effectLayerUrl'] ?? null;
                    $event['musicUrl'] = $event['musicUrl'] ?? ($template['musicUrl'] ?? null);
                    $event['effectLayerOpacity'] = $template['effectLayerOpacity'] ?? 1.0;
                    $event['effectLayerBlendMode'] = $template['effectLayerBlendMode'] ?? 'screen';
                    $event['templateConfig'] = $mergeTemplateConfigs($template['templateConfig'] ?? null, $event['templateConfig'] ?? null);
                    $event['backgroundImageUrl'] = $template['backgroundImageUrl'] ?? null;
                    $event['buttonImageUrl'] = $template['buttonImageUrl'] ?? null;
                    $event['guestFrameUrl'] = $template['guestFrameUrl'] ?? null;

                    if (empty($event['introFrameUrl']))
                        $event['introFrameUrl'] = $template['introFrameUrl'] ?? null;
                    if (empty($event['transitionFrameUrl']))
                        $event['transitionFrameUrl'] = $template['transitionFrameUrl'] ?? null;
                    if (empty($event['detailFrameUrl']))
                        $event['detailFrameUrl'] = $template['detailFrameUrl'] ?? null;
                }
            } catch (Exception $e) {
                // Ignore template fetch errors (e.g. missing columns) to allow event to load
                error_log("Failed to fetch template assets in fallback: " . $e->getMessage());
            }
        }

        if ($event) {
            $event['featureLimits'] = getUserPlanLimits($pdo, $event['userId'] ?? null);
            echo json_encode(['success' => true, 'event' => $event]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Event not found']);
        }
        return;
    }

    if (isset($_GET['id'])) {
        // Get Single Event
        $isPublic = $publicAccess || isset($_GET['public']);

        if ($isPublic) {
            $stmt = $pdo->prepare("SELECT * FROM Event WHERE id = :id");
            $stmt->execute(['id' => $_GET['id']]);
        } else {
            // Allow Admin to view any event
            if (in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) || ($user['isSuperAdmin'] ?? false)) {
                $stmt = $pdo->prepare("SELECT * FROM Event WHERE id = :id");
                $stmt->execute(['id' => $_GET['id']]);
            } else {
                $stmt = $pdo->prepare("SELECT * FROM Event WHERE id = :id AND userId = :userId");
                $stmt->execute(['id' => $_GET['id'], 'userId' => $user['userId']]);
            }
        }
        $event = $stmt->fetch();

        if ($event) {
            $event['featureLimits'] = getUserPlanLimits($pdo, $event['userId'] ?? null);
            // Fetch Album Photos
            $stmtPhotos = $pdo->prepare("SELECT * FROM AlbumPhoto WHERE eventId = :eventId ORDER BY `order` ASC, createdAt ASC");
            $stmtPhotos->execute(['eventId' => $event['id']]);
            $event['albumPhotos'] = $stmtPhotos->fetchAll();

            // Fetch Template Assets (Videos & Effects)
            try {
                $stmtTemplate = $pdo->prepare("SELECT backgroundVideoUrl, backgroundImageUrl, introVideoUrl, transitionVideoUrl, effectLayerUrl, musicUrl, effectLayerOpacity, effectLayerBlendMode, introFrameUrl, transitionFrameUrl, detailFrameUrl, buttonImageUrl, guestFrameUrl, templateConfig FROM Template WHERE codeKey = :codeKey OR id = :id");
                $stmtTemplate->execute(['codeKey' => $event['templateId'], 'id' => $event['templateId']]);
                $template = $stmtTemplate->fetch();

                if ($template) {
                    $event['backgroundVideoUrl'] = $template['backgroundVideoUrl'];
                    $event['introVideoUrl'] = $template['introVideoUrl'];
                    $event['transitionVideoUrl'] = $template['transitionVideoUrl'];
                    $event['effectLayerUrl'] = $template['effectLayerUrl'];
                    $event['musicUrl'] = $event['musicUrl'] ?? $template['musicUrl'];
                    $event['effectLayerOpacity'] = $template['effectLayerOpacity'];
                    $event['effectLayerBlendMode'] = $template['effectLayerBlendMode'];
                    $event['templateConfig'] = $mergeTemplateConfigs($template['templateConfig'], $event['templateConfig'] ?? null);
                    $event['backgroundImageUrl'] = $template['backgroundImageUrl'];
                    $event['buttonImageUrl'] = $template['buttonImageUrl'];
                    $event['guestFrameUrl'] = $template['guestFrameUrl'];
                    // Use template frames if event frames are missing
                    if (empty($event['introFrameUrl']))
                        $event['introFrameUrl'] = $template['introFrameUrl'];
                    if (empty($event['transitionFrameUrl']))
                        $event['transitionFrameUrl'] = $template['transitionFrameUrl'];
                    if (empty($event['detailFrameUrl']))
                        $event['detailFrameUrl'] = $template['detailFrameUrl'];
                }
            } catch (Exception $e) {
                // Ignore template fetch errors (e.g. missing columns) to allow event to load
                error_log("Failed to fetch template assets: " . $e->getMessage());
            }
        }

        echo json_encode(['success' => true, 'event' => $event]);
    } else {
        // List Events with Guest Count
        // List Events
        if (in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) || ($user['isSuperAdmin'] ?? false)) {
            // Admin sees ALL events (or maybe filtered if we add admin filters later)
            // For now, let's just show all events for admin dashboard
            $sql = "SELECT e.*, u.email as userEmail, (SELECT COUNT(*) FROM Guest g WHERE g.eventId = e.id) as guestCount 
                    FROM Event e 
                    LEFT JOIN User u ON e.userId = u.id
                    ORDER BY e.createdAt DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        } else {
            // Regular user sees own events
            $sql = "SELECT e.*, (SELECT COUNT(*) FROM Guest g WHERE g.eventId = e.id) as guestCount 
                    FROM Event e 
                    WHERE e.userId = :userId 
                    ORDER BY e.createdAt DESC";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['userId' => $user['userId']]);
        }
        $events = $stmt->fetchAll();
        echo json_encode(['success' => true, 'events' => $events]);
    }
}

function handlePost($pdo, $user)
{
    $input = json_decode(file_get_contents('php://input'), true);

    // Required fields
    if (empty($input['title']) || empty($input['date'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Title and Date are required']);
        return;
    }

    // Enforce plan requirement for CLIENT (admins bypass)
    if (!in_array($user['role'] ?? '', ['ADMIN', 'SUPER_ADMIN']) && !($user['isSuperAdmin'] ?? false)) {
        // Check if user has a plan
        try {
            $stmt = $pdo->prepare("SELECT planId FROM User WHERE id = :id");
            $stmt->execute(['id' => $user['userId']]);
            $userPlan = $stmt->fetch();
            $planId = $userPlan['planId'] ?? null;

            if (empty($planId)) {
                http_response_code(403);
                echo json_encode(['error' => 'You must select a plan before creating events. Please choose a plan to continue.']);
                return;
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Unable to verify plan. Please try again.']);
            return;
        }

        // Enforce max events limit for CLIENT (admins bypass)
        $limits = getUserPlanLimits($pdo, $user['userId'], $user['role'] ?? null, $user['isSuperAdmin'] ?? false);
        if (!isUnlimited($limits['maxEvents'])) {
            $stmt = $pdo->prepare("SELECT COUNT(*) as cnt FROM Event WHERE userId = :userId");
            $stmt->execute(['userId' => $user['userId']]);
            $count = (int) $stmt->fetch()['cnt'];
            if ($count >= $limits['maxEvents']) {
                http_response_code(403);
                echo json_encode(['error' => 'Event limit reached. Your plan allows up to ' . $limits['maxEvents'] . ' event' . ($limits['maxEvents'] !== 1 ? 's' : '') . '. Please contact support to upgrade.']);
                return;
            }
        }

        $secondaryLanguageFields = [
            'titleEn',
            'locationEn',
            'groomFatherNameEn',
            'groomMotherNameEn',
            'brideFatherNameEn',
            'brideMotherNameEn',
            'groomFirstNameEn',
            'groomLastNameEn',
            'brideFirstNameEn',
            'brideLastNameEn',
            'invitationMessageEn',
            'venueDetailsEn',
        ];
        $wantsSecondaryLanguage = !empty($input['enableSecondaryLanguage']);
        foreach ($secondaryLanguageFields as $field) {
            if (!empty($input[$field])) {
                $wantsSecondaryLanguage = true;
                break;
            }
        }
        if ($wantsSecondaryLanguage && (($limits['maxLanguages'] ?? 1) < 2)) {
            http_response_code(403);
            echo json_encode(['error' => 'Your plan does not support multiple languages. Please upgrade to enable Khmer and English content.']);
            return;
        }
    }

    $uuid = vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex(random_bytes(16)), 4));

    try {
        $sql = "INSERT INTO Event (
            id, title, date, location, description, eventType,
            templateId, eventDays, birthDate, userId, createdAt, updatedAt
        ) VALUES (
            :id, :title, :date, :location, :description, :eventType,
            :templateId, :eventDays, :birthDate, :userId, NOW(), NOW()
        )";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            'id' => $uuid,
            'title' => $input['title'],
            'date' => date('Y-m-d H:i:s', strtotime($input['date'])),
            'location' => $input['location'] ?? '',
            'description' => $input['description'] ?? '',
            'eventType' => $input['eventType'] ?? 'wedding',
            'templateId' => $input['templateId'] ?? 'premium-gold',
            'eventDays' => $input['schedule'] ?? null, // Map schedule input to eventDays column
            'birthDate' => !empty($input['birthDate']) ? date('Y-m-d H:i:s', strtotime($input['birthDate'])) : null,
            'userId' => $user['userId']
        ]);

        echo json_encode(['success' => true, 'event' => ['id' => $uuid]]);

    } catch (PDOException $e) {
        http_response_code(500);
        error_log('Event create error: ' . $e->getMessage());
        echo json_encode(['error' => 'Failed to create event. Please try again.']);
    }
}

function handlePut($pdo, $user)
{
    $input = json_decode(file_get_contents('php://input'), true);

    if (empty($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Event ID required']);
        return;
    }

    // Build Access Control Check
    if (in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) || ($user['isSuperAdmin'] ?? false)) {
        // Admin can edit any event
    } else {
        $stmt = $pdo->prepare("SELECT id FROM Event WHERE id = :id AND userId = :userId");
        $stmt->execute(['id' => $input['id'], 'userId' => $user['userId']]);
        if (!$stmt->fetch()) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden']);
            return;
        }
    }

    // Build Dynamic Update Query
    $fields = [];
    $params = ['id' => $input['id']];


    if (!in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) && !($user['isSuperAdmin'] ?? false)) {
        $limits = getUserPlanLimits($pdo, $user['userId'], $user['role'] ?? null, $user['isSuperAdmin'] ?? false);
        $secondaryLanguageFields = [
            'titleEn',
            'locationEn',
            'groomFatherNameEn',
            'groomMotherNameEn',
            'brideFatherNameEn',
            'brideMotherNameEn',
            'groomFirstNameEn',
            'groomLastNameEn',
            'brideFirstNameEn',
            'brideLastNameEn',
            'invitationMessageEn',
            'venueDetailsEn',
        ];
        $wantsSecondaryLanguage = array_key_exists('enableSecondaryLanguage', $input)
            ? !empty($input['enableSecondaryLanguage'])
            : false;

        foreach ($secondaryLanguageFields as $field) {
            if (array_key_exists($field, $input) && trim((string) $input[$field]) !== '') {
                $wantsSecondaryLanguage = true;
                break;
            }
        }

        if ($wantsSecondaryLanguage && (($limits['maxLanguages'] ?? 1) < 2)) {
            http_response_code(403);
            echo json_encode(['error' => 'Your plan does not support multiple languages. Please upgrade to enable Khmer and English content.']);
            return;
        }

        $requestedAlbumVideos = $input['albumVideos'] ?? null;
        $wantsEmbeddedVideo = false;
        if (is_array($requestedAlbumVideos)) {
            $wantsEmbeddedVideo = count(array_filter(array_map(static function ($item) {
                return trim((string) $item);
            }, $requestedAlbumVideos))) > 0;
        } elseif (is_string($requestedAlbumVideos)) {
            $wantsEmbeddedVideo = trim($requestedAlbumVideos) !== '';
        }

        if ($wantsEmbeddedVideo && empty($limits['embedVideo'])) {
            http_response_code(403);
            echo json_encode(['error' => 'Your plan does not support embedded video. Please upgrade to add YouTube or Vimeo content.']);
            return;
        }

        $requestedPaymentQrImage = isset($input['paymentQrImageUrl']) ? trim((string) $input['paymentQrImageUrl']) : '';
        if ($requestedPaymentQrImage !== '' && empty($limits['qrCheckin'])) {
            http_response_code(403);
            echo json_encode(['error' => 'Your plan does not support QR payment display. Please upgrade to upload and show a payment QR image.']);
            return;
        }
    }

    $fillable = [
        'title',
        'titleEn',
        'date',
        'location',
        'locationEn',
        'eventType',
        'description',
        'templateId',
        'musicUrl',
        'logoUrl',
        'secondLogoUrl',
        'shareImageUrl',
        'paymentQrImageUrl',
        'birthDate',
        'contactPhone',
        'enableSecondaryLanguage',
        'templateConfig',
        'introFrameUrl',
        'transitionFrameUrl',
        'detailFrameUrl',
        'groomFatherName',
        'groomMotherName',
        'groomFatherNameEn',
        'groomMotherNameEn',
        'brideFatherName',
        'brideMotherName',
        'brideFatherNameEn',
        'brideMotherNameEn',
        'groomFirstName',
        'groomLastName',
        'groomFirstNameEn',
        'groomLastNameEn',
        'brideFirstName',
        'brideLastName',
        'brideFirstNameEn',
        'brideLastNameEn',
        'invitationMessage',
        'invitationMessageEn',
        'venueDetails',
        'venueDetailsEn',
        'mapUrl',
        'startDate',
        'endDate',
        'eventDays',
        'schedule',
        'albumVideos',
        'slug',
        'logoSize',
        'is_active'
    ];

    // Check existing columns in Event table to prevent SQL errors on older database schemas
    try {
        $colStmt = $pdo->query("SHOW COLUMNS FROM Event");
        $existingCols = $colStmt ? $colStmt->fetchAll(PDO::FETCH_COLUMN) : [];
    } catch (Throwable $e) {
        $existingCols = [];
    }

    foreach ($fillable as $field) {
        if (array_key_exists($field, $input)) {
            // Skip fields that do not exist in the database table schema
            if (!empty($existingCols) && !in_array($field, $existingCols)) {
                continue;
            }

            $fields[] = "$field = :$field";
            // Safe Date handling
            if (strpos($field, 'Date') !== false || $field === 'date') {
                if (!empty($input[$field])) {
                    $timestamp = strtotime($input[$field]);
                    $params[$field] = $timestamp ? date('Y-m-d H:i:s', $timestamp) : null;
                } else {
                    $params[$field] = null;
                }
            } elseif ($field === 'templateConfig') {
                if (is_array($input[$field])) {
                    $params[$field] = json_encode($input[$field], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                } else {
                    $params[$field] = $input[$field];
                }
            } elseif ($field === 'albumVideos') {
                if (is_array($input[$field])) {
                    $params[$field] = json_encode(array_values($input[$field]), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                } else {
                    $params[$field] = $input[$field];
                }
            } elseif ($field === 'enableSecondaryLanguage') {
                $params[$field] = !empty($input[$field]) ? 1 : 0;
            } else {
                $params[$field] = $input[$field];
            }
        }
    }

    if (empty($fields)) {
        echo json_encode(['success' => true, 'message' => 'No changes']);
        return;
    }

    $fields[] = "updatedAt = NOW()";
    $sql = "UPDATE Event SET " . implode(', ', $fields) . " WHERE id = :id";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        echo json_encode(['success' => true]);
    } catch (Throwable $e) {
        http_response_code(500);
        error_log('Event update error: ' . $e->getMessage());
        echo json_encode(['error' => 'Failed to update event: ' . $e->getMessage()]);
    }
}

function handleDelete($pdo, $user)
{
    $id = $_GET['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'ID required']);
        return;
    }

    if (in_array(($user['role'] ?? ''), ['ADMIN', 'SUPER_ADMIN']) || ($user['isSuperAdmin'] ?? false)) {
        $stmt = $pdo->prepare("DELETE FROM Event WHERE id = :id");
        $stmt->execute(['id' => $id]);
    } else {
        $stmt = $pdo->prepare("DELETE FROM Event WHERE id = :id AND userId = :userId");
        $stmt->execute(['id' => $id, 'userId' => $user['userId']]);
    }

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Event not found or access denied']);
    }
}
?>
