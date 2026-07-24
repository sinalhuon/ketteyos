<?php
require_once 'cors.php';
require_once 'db.php';

// Public endpoint to fetch app settings (for invitation footer)
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT appName, appLogo, appLogoDark, mobileAppLogo, mobileAppLogoDark, favicon, facebookUrl, tiktokUrl, youtubeUrl, telegramUrl, contactEmail, contactPhone, contactTelegram, contactWhatsApp, contactWeChat, googleAnalyticsId, telegramBotToken, telegramChatId, bakongToken, bakongAccountId, bakongAccountName, bakongMerchantCity, landingShowcaseEventIds, landingTemplateIds FROM AppSettings LIMIT 1");
        $settings = $stmt->fetch();

        if (!$settings) {
            $settings = [
                'appName' => 'KETTEKYUOS',
                'appLogo' => null,
                'appLogoDark' => null,
                'favicon' => null,
                'facebookUrl' => null,
                'tiktokUrl' => null,
                'youtubeUrl' => null,
                'telegramUrl' => null,
                'contactEmail' => null,
                'contactPhone' => null,
                'contactTelegram' => null,
                'contactWhatsApp' => null,
                'contactWeChat' => null,
                'googleAnalyticsId' => null,
                'telegramBotToken' => null,
                'telegramChatId' => null,
                'bakongToken' => null,
                'bakongAccountId' => null,
                'bakongAccountName' => null,
                'bakongMerchantCity' => null,
                'landingShowcaseEventIds' => null,
                'landingTemplateIds' => null,
            ];
        }

        echo json_encode(['success' => true, 'settings' => $settings]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            'error' => 'Database error',
            'message' => 'Settings could not be loaded. Please make sure the database schema is up to date.'
        ]);
    }
}
?>
