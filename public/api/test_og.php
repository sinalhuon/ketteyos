<?php
// Local test endpoint to preview OpenGraph images without deploying or creating database guests
$_SERVER['HTTP_HOST'] = $_SERVER['HTTP_HOST'] ?? 'localhost:8000';

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/og_helpers.php';

$guestName = $_GET['name'] ?? 'ស្រី នីត';

$guest = [
    'id' => 'test-guest',
    'name' => $guestName,
    'guestName' => $guestName,
];

$canvasW = 1200;
$canvasH = 630;
$canvas = imagecreatetruecolor($canvasW, $canvasH);
imagealphablending($canvas, true);
imagesavealpha($canvas, true);

// Dark poster background simulation
$black = imagecolorallocate($canvas, 15, 15, 20);
imagefill($canvas, 0, 0, $black);

// Draw title preview at top
$font = og_font_path('heading');
$white = imagecolorallocate($canvas, 255, 255, 255);
og_draw_centered_text($canvas, "សូមអញ្ជើញចូលរួមកម្មវិធី", 26, 120, $white, $font, 1000);

// Draw guest photo circle & guest name pill container
og_draw_guest_photo_on_movie_poster($canvas, $guest, 'http://localhost:8000');

// Output JPEG directly to browser
header('Content-Type: image/jpeg');
header('Cache-Control: no-cache');
imagejpeg($canvas, null, 90);
imagedestroy($canvas);
