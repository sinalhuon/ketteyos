<?php
// Local test endpoint to preview OpenGraph images using the actual movie poster background
$_SERVER['HTTP_HOST'] = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/og_helpers.php';

$guestName = $_GET['name'] ?? 'ស្រី នីត ស្ត្រី';

$guest = [
    'id' => 'test-guest',
    'name' => $guestName,
    'guestName' => $guestName,
];

// Load actual movie poster background image
$bgFile = dirname(__DIR__) . '/assets/movie_poster_bg.jpg';
if (file_exists($bgFile)) {
    $canvas = imagecreatefromjpeg($bgFile);
    $canvasW = imagesx($canvas);
    $canvasH = imagesy($canvas);
} else {
    $canvasW = 1200;
    $canvasH = 630;
    $canvas = imagecreatetruecolor($canvasW, $canvasH);
    $black = imagecolorallocate($canvas, 15, 15, 20);
    imagefill($canvas, 0, 0, $black);
}

imagealphablending($canvas, true);
imagesavealpha($canvas, true);

// Draw guest photo circle & guest name pill container on the poster
og_draw_guest_photo_on_movie_poster($canvas, $guest, 'http://localhost:8000');

// Output JPEG directly to browser
header('Content-Type: image/jpeg');
header('Cache-Control: no-cache');
imagejpeg($canvas, null, 92);
imagedestroy($canvas);
