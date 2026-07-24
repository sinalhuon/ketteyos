<?php
require_once 'cors.php';
require_once 'db.php';

header('Content-Type: application/json');

// Helper: Make HTTP request using cURL (works on most shared hosting)
function telegramApiRequest($url, $postData = null)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);

    if ($postData !== null) {
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
    }

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        return ['ok' => false, 'curl_error' => $error];
    }

    return json_decode($response, true);
}

// Handle webhook setup request from admin panel
if (isset($_GET['action'])) {
    $action = $_GET['action'];

    if ($action === 'setup' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        // Admin wants to connect: set up webhook and return bot username
        $input = json_decode(file_get_contents('php://input'), true);
        $botToken = $input['botToken'] ?? '';

        if (empty($botToken)) {
            echo json_encode(['success' => false, 'error' => 'Bot token is required']);
            exit;
        }

        // Step 1: Get bot info (username)
        $botInfo = telegramApiRequest("https://api.telegram.org/bot$botToken/getMe");

        if (!$botInfo || !isset($botInfo['ok']) || !$botInfo['ok']) {
            $errMsg = $botInfo['curl_error'] ?? ($botInfo['description'] ?? 'Unknown error');
            echo json_encode(['success' => false, 'error' => 'Invalid bot token: ' . $errMsg]);
            exit;
        }

        $botUsername = $botInfo['result']['username'];

        // Step 2: Save bot token to DB
        try {
            $stmt = $pdo->query("SELECT id FROM AppSettings LIMIT 1");
            $existing = $stmt->fetch();

            if ($existing) {
                $update = $pdo->prepare("UPDATE AppSettings SET telegramBotToken = :token WHERE id = :id");
                $update->execute(['token' => $botToken, 'id' => $existing['id']]);
            }
        } catch (Exception $e) {
            // Log but continue
            error_log("Telegram setup DB error: " . $e->getMessage());
        }

        // Step 3: Set webhook to this script
        $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'];
        $webhookUrl = "$protocol://$host/api/telegram_webhook.php";

        $webhookResult = telegramApiRequest(
            "https://api.telegram.org/bot$botToken/setWebhook",
            ['url' => $webhookUrl]
        );

        echo json_encode([
            'success' => true,
            'botUsername' => $botUsername,
            'webhookSet' => ($webhookResult && isset($webhookResult['ok']) && $webhookResult['ok'])
        ]);
        exit;
    }

    if ($action === 'check') {
        // Check if chat ID has been saved (user sent /start)
        try {
            $stmt = $pdo->query("SELECT telegramChatId FROM AppSettings LIMIT 1");
            $row = $stmt->fetch();

            if ($row && !empty($row['telegramChatId'])) {
                echo json_encode(['connected' => true, 'chatId' => $row['telegramChatId']]);
            } else {
                echo json_encode(['connected' => false]);
            }
        } catch (Exception $e) {
            echo json_encode(['connected' => false, 'error' => 'Check failed.']);
        }
        exit;
    }

    echo json_encode(['error' => 'Unknown action']);
    exit;
}

// --- Handle Telegram Webhook Updates ---
// This is called by Telegram when someone sends a message to the bot
$rawInput = file_get_contents('php://input');
$update = json_decode($rawInput, true);

if (!$update || !isset($update['message'])) {
    http_response_code(200);
    echo 'ok';
    exit;
}

$message = $update['message'];
$chatId = $message['chat']['id'];
$text = $message['text'] ?? '';
$firstName = $message['from']['first_name'] ?? 'User';

// Handle /start command
if (strpos($text, '/start') === 0) {
    try {
        // Save chat ID to AppSettings
        $stmt = $pdo->query("SELECT id, telegramBotToken FROM AppSettings LIMIT 1");
        $settings = $stmt->fetch();

        if ($settings) {
            $update_stmt = $pdo->prepare("UPDATE AppSettings SET telegramChatId = :chatId WHERE id = :id");
            $update_stmt->execute(['chatId' => (string) $chatId, 'id' => $settings['id']]);

            // Send confirmation message
            $botToken = $settings['telegramBotToken'];
            if ($botToken) {
                $confirmMessage = "✅ *Connected Successfully!*\n\n" .
                    "Hello $firstName! 👋\n\n" .
                    "This bot is now connected to your *Ketteyos* admin panel.\n\n" .
                    "You will receive instant notifications when:\n" .
                    "• 📝 A new client registers\n" .
                    "• 📊 Important events occur\n\n" .
                    "Go back to your settings page and click *Check Connection*!";

                telegramApiRequest(
                    "https://api.telegram.org/bot$botToken/sendMessage",
                    [
                        'chat_id' => $chatId,
                        'text' => $confirmMessage,
                        'parse_mode' => 'Markdown'
                    ]
                );
            }
        }
    } catch (Exception $e) {
        error_log("Telegram webhook error: " . $e->getMessage());
    }
}

http_response_code(200);
echo 'ok';
?>
