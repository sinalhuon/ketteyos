<?php
// invite_entry.php
// Dynamic OpenGraph / Social Share Handler for Ketteyos Invitations

header('Cache-Control: public, max-age=3600');
header('X-Robots-Tag: noindex');

require_once 'api/db.php';
require_once 'api/og_helpers.php';

// 1. Parse Request URI to get Slug or ID
$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$basePath = '/invite/';
$identifier = '';
$guestIdentifier = '';

if (strpos($requestUri, $basePath) !== false) {
    $parts = explode('/', trim(parse_url($requestUri, PHP_URL_PATH), '/'));
    $inviteIndex = array_search('invite', $parts);
    if ($inviteIndex !== false && isset($parts[$inviteIndex + 1])) {
        $identifier = $parts[$inviteIndex + 1];
        if (isset($parts[$inviteIndex + 2])) {
            $guestIdentifier = $parts[$inviteIndex + 2];
        }
    }
}

// Base Setup
$protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'https://' : 'http://';
$host = $_SERVER['HTTP_HOST'] ?? 'ketteyos.com';
$baseUrl = $protocol . $host;

$title = "សូមគោរពអញ្ជើញ ភ្ញៀវកិត្តិយស";
$description = "សូមគោរពអញ្ជើញចូលរួមកម្មវិធីជាកិត្តិយស";
$image = $baseUrl . "/icon.png";
$imageType = '';
$imageWidth = 1200;
$imageHeight = 630;
$url = $baseUrl . $requestUri;

// Helper function for Khmer Numbers
function toKhmerNumber($num)
{
    $khmerNumbers = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    $strNum = (string) $num;
    $result = '';
    for ($i = 0; $i < strlen($strNum); $i++) {
        $char = $strNum[$i];
        if (is_numeric($char)) {
            $result .= $khmerNumbers[(int) $char];
        } else {
            $result .= $char;
        }
    }
    return $result;
}

// Helper for Khmer Month
function getKhmerMonth($monthIndex)
{
    $months = [
        'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
        'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
    ];
    return $months[$monthIndex] ?? '';
}

// Helper for Khmer Day
function getKhmerDay($dayIndex)
{
    $days = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
    return $days[$dayIndex] ?? '';
}

function makeAbsoluteUrl($url, $baseUrl)
{
    if (empty($url)) return '';
    if (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0) {
        return $url;
    }
    return $baseUrl . '/' . ltrim($url, '/');
}

function metaContent($value)
{
    return htmlspecialchars(trim(preg_replace('/\s+/', ' ', (string) $value)), ENT_QUOTES, 'UTF-8');
}

// Format rich Khmer event description (date, time, location, phone)
function buildKhmerDescription($event)
{
    $parts = [];
    $rawDate = $event['startDate'] ?? ($event['date'] ?? '');

    if (!empty($rawDate)) {
        try {
            $dateObj = new DateTime($rawDate);
            $dayName = getKhmerDay((int) $dateObj->format('w'));
            $dayNumKh = toKhmerNumber($dateObj->format('j'));
            $monthName = getKhmerMonth((int) $dateObj->format('n') - 1);
            $yearKh = toKhmerNumber($dateObj->format('Y'));
            $parts[] = "📅 ថ្ងៃ" . $dayName . " ទី" . $dayNumKh . " ខែ" . $monthName . " ឆ្នាំ" . $yearKh;

            $hour = (int) $dateObj->format('G');
            $period = ($hour >= 5 && $hour < 12) ? 'ព្រឹក' : (($hour >= 12 && $hour < 17) ? 'រសៀល' : (($hour >= 17 && $hour < 20) ? 'ល្ងាច' : 'យប់'));
            $hour12 = $hour > 12 ? $hour - 12 : ($hour == 0 ? 12 : $hour);
            $parts[] = "⏰ វេលាម៉ោង " . toKhmerNumber($hour12) . ":" . toKhmerNumber($dateObj->format('i')) . " " . $period;
        } catch (Exception $e) {}
    }

    $locationStr = str_replace(["\r", "\n"], " ", !empty($event['venueDetails']) ? $event['venueDetails'] : ($event['location'] ?? ''));
    if (!empty($locationStr)) {
        $parts[] = "📍 " . trim($locationStr);
    }

    if (!empty($event['contactPhone'])) {
        $parts[] = "📞 ទំនាក់ទំនង: " . trim($event['contactPhone']);
    }

    return implode("\n", $parts);
}

function buildMovieShareDescription($event, $guestName)
{
    $invitee = trim((string) $guestName);
    if ($invitee === '') {
        $invitee = !empty($event['title']) ? $event['title'] : 'ភ្ញៀវកិត្តិយស';
    }

    $intro = "សូមគោរពអញ្ជើញ " . $invitee . "\nចូលរួមកម្មវិធីសម្ភោធខ្សែភាពយន្តខ្មែរ";
    $details = buildKhmerDescription($event);

    return trim($intro . ($details !== '' ? "\n" . $details : ''));
}

if ($identifier) {
    try {
        $event = null;
        $guestData = null;

        // 1. Check if identifier is a Guest Short Code, Token, or ID (e.g. H62CQ)
        $guestData = og_fetch_guest($pdo, $identifier);

        if ($guestData) {
            $guestIdentifier = $identifier;
            $event = og_fetch_event($pdo, $guestData['eventId'] ?? '', true);
        } else {
            // 2. Check by Event Slug or Event ID
            $event = og_fetch_event($pdo, $identifier);

            if ($event && !empty($guestIdentifier)) {
                $guestData = og_fetch_guest($pdo, $guestIdentifier, $event['id'] ?? '');
            }
        }

        if ($event) {
            if (isset($event['is_active']) && (int)$event['is_active'] === 0) {
                $title = "Event Expired / កម្មវិធីបានបញ្ចប់";
                $description = "This invitation is no longer active.";
            } else {
                $guestName = $guestData['name'] ?? '';

                if (og_is_movie_event($event)) {
                    $title = "Ketteyos";
                    $description = buildMovieShareDescription($event, $guestName);
                    $image = og_build_dynamic_image_url($baseUrl, $event, $guestIdentifier, $guestData);
                    $imageType = 'image/jpeg';
                    $imageSize = og_movie_poster_dimensions($event, $baseUrl);
                    $imageWidth = (int) $imageSize['width'];
                    $imageHeight = (int) $imageSize['height'];
                } else {
                    if (!empty($guestName)) {
                        $title = "សូមគោរពអញ្ជើញ " . $guestName;
                    } else {
                        $title = "សូមគោរពអញ្ជើញ " . (!empty($event['title']) ? $event['title'] : "ភ្ញៀវកិត្តិយស");
                    }

                    $description = buildKhmerDescription($event);
                    if (empty($description)) {
                        $description = !empty($event['invitationMessage']) ? $event['invitationMessage'] : "សូមគោរពអញ្ជើញចូលរួមកម្មវិធីជាកិត្តិយស";
                    }

                    // Keep the old non-movie thumbnail priority: guest photo, event share image, event/template media, then logo.
                    $oldImage = og_static_preview_image_url($event, $guestData, $baseUrl, true);
                    if ($oldImage !== '') {
                        $image = makeAbsoluteUrl($oldImage, $baseUrl);
                    }
                }
            }
        }
    } catch (Throwable $e) {
        // Silently fail to defaults
    }
}

$possiblePaths = [
    __DIR__ . '/invite/default/index.html',                 // "next export" output
    __DIR__ . '/../out/invite/default/index.html',          // Local dev fallback
    __DIR__ . '/../.next/server/app/invite/default.html',   // Server build
    __DIR__ . '/../server/app/invite/default.html',         // Production build
    __DIR__ . '/invite_templates/default/index.html',       // Legacy fallback
];

$templatePath = '';
foreach ($possiblePaths as $path) {
    if (file_exists($path)) {
        $templatePath = $path;
        break;
    }
}

if ($templatePath) {
    $html = file_get_contents($templatePath);

    // Update <title> and <meta name="description">
    $html = preg_replace('/<title>.*?<\/title>/', "<title>" . metaContent($title) . "</title>", $html);
    $html = preg_replace('/<meta name="description" content=".*?" \/>/', '<meta name="description" content="' . metaContent($description) . '" />', $html);

    // Remove existing OG / Twitter tags
    $html = preg_replace('/<meta\s+property=["\']og:[^"\']+["\']\s+content=["\'][^"\']*["\']\s*\/?>/i', '', $html);
    $html = preg_replace('/<meta\s+name=["\']twitter:[^"\']+["\']\s+content=["\'][^"\']*["\']\s*\/?>/i', '', $html);
    $html = preg_replace('/<link\s+rel=["\']canonical["\'][^>]*>/i', '', $html);
    $html = preg_replace('/<meta\s+name=["\']next-head-count["\'][^>]*>/i', '', $html);

    // Construct the OG Tags block
    $ogTags = "\n";
    $ogTags .= '<meta property="og:title" content="' . metaContent($title) . '" />' . "\n";
    $ogTags .= '<meta property="og:description" content="' . metaContent($description) . '" />' . "\n";
    $ogTags .= '<meta property="og:image" content="' . metaContent($image) . '" />' . "\n";
    $ogTags .= '<meta property="og:image:url" content="' . metaContent($image) . '" />' . "\n";
    $ogTags .= '<meta property="og:image:secure_url" content="' . metaContent($image) . '" />' . "\n";
    $ogTags .= '<meta property="og:image:width" content="' . (int) $imageWidth . '" />' . "\n";
    $ogTags .= '<meta property="og:image:height" content="' . (int) $imageHeight . '" />' . "\n";
    if ($imageType !== '') {
        $ogTags .= '<meta property="og:image:type" content="' . metaContent($imageType) . '" />' . "\n";
    }
    $ogTags .= '<meta property="og:image:alt" content="' . metaContent($title) . '" />' . "\n";
    $ogTags .= '<meta property="og:url" content="' . metaContent($url) . '" />' . "\n";
    $ogTags .= '<meta property="og:type" content="website" />' . "\n";
    $ogTags .= '<meta property="og:site_name" content="Ketteyos" />' . "\n";

    // Twitter Card tags
    $ogTags .= '<meta name="twitter:card" content="summary_large_image" />' . "\n";
    $ogTags .= '<meta name="twitter:title" content="' . metaContent($title) . '" />' . "\n";
    $ogTags .= '<meta name="twitter:description" content="' . metaContent($description) . '" />' . "\n";
    $ogTags .= '<meta name="twitter:image" content="' . metaContent($image) . '" />' . "\n";

    // Inject before </head>
    if (strpos($html, '</head>') !== false) {
        $html = str_replace('</head>', $ogTags . '</head>', $html);
    } else {
        $html .= $ogTags;
    }

    echo $html;
} else {
    // Fallback if template missing
    header('Content-Type: text/html; charset=utf-8');
    echo "<!DOCTYPE html><html><head>";
    echo "<title>" . metaContent($title) . "</title>";
    echo '<meta property="og:title" content="' . metaContent($title) . '" />';
    echo '<meta property="og:description" content="' . metaContent($description) . '" />';
    echo '<meta property="og:image" content="' . metaContent($image) . '" />';
    echo "</head><body><h1>" . metaContent($title) . "</h1><p>" . nl2br(htmlspecialchars($description, ENT_QUOTES, 'UTF-8')) . "</p></body></html>";
}
