<?php
// og_image.php
// Dynamic OpenGraph Image Handler for Social Media Link Previews

require_once 'db.php';
require_once 'og_helpers.php';

header('Cache-Control: public, max-age=3600');

$slug = $_GET['slug'] ?? ($_GET['id'] ?? '');
$guestId = $_GET['guest'] ?? '';

$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'ketteyos.com';
$baseUrl = $protocol . $host;
$fallbackUrl = $baseUrl . '/icon.png';

function makeAbsUrl($url, $baseUrl) {
    if (empty($url)) return '';
    if (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0) {
        return $url;
    }
    return $baseUrl . '/' . ltrim($url, '/');
}

if (empty($slug) && empty($guestId)) {
    header("Location: " . $fallbackUrl, true, 302);
    exit;
}

try {
    $event = null;
    $guestData = null;

    if (!empty($guestId)) {
        $guestData = og_fetch_guest($pdo, $guestId);

        if ($guestData && !empty($guestData['eventId'])) {
            $event = og_fetch_event($pdo, $guestData['eventId'], true);
        }
    }

    if (!$event && !empty($slug)) {
        $event = og_fetch_event($pdo, $slug);
    }

    if ($event) {
        if (!empty($guestId) && !$guestData) {
            $guestData = og_fetch_guest($pdo, $guestId, $event['id'] ?? '');
        }

        if (og_is_movie_event($event) && og_send_movie_front_page_image($event, $guestData, $baseUrl)) {
            exit;
        }

        $targetImg = og_static_preview_image_url($event, $guestData, $baseUrl, true);
        if ($targetImg !== '') {
            $abs = makeAbsUrl($targetImg, $baseUrl);
            header("Location: " . $abs, true, 302);
            exit;
        }
    }

    header("Location: " . $fallbackUrl, true, 302);
    exit;

} catch (Throwable $e) {
    header("Location: " . $fallbackUrl, true, 302);
    exit;
}
