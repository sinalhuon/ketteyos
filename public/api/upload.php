<?php
require_once 'cors.php';
require_once 'db.php';
require_once 'jwt.php';

function parseIniSizeToBytes($value)
{
    $value = trim((string) $value);
    if ($value === '') return 0;

    $unit = strtolower(substr($value, -1));
    $number = (float) $value;

    switch ($unit) {
        case 'g':
            return (int) ($number * 1024 * 1024 * 1024);
        case 'm':
            return (int) ($number * 1024 * 1024);
        case 'k':
            return (int) ($number * 1024);
        default:
            return (int) $number;
    }
}

function formatBytesToReadable($bytes)
{
    if ($bytes >= 1024 * 1024 * 1024) return round($bytes / (1024 * 1024 * 1024), 1) . ' GB';
    if ($bytes >= 1024 * 1024) return round($bytes / (1024 * 1024), 1) . ' MB';
    if ($bytes >= 1024) return round($bytes / 1024, 1) . ' KB';
    return $bytes . ' bytes';
}

function getUploadErrorMessage($fileError)
{
    $uploadMax = parseIniSizeToBytes(ini_get('upload_max_filesize'));
    $postMax = parseIniSizeToBytes(ini_get('post_max_size'));
    $effectiveMax = 0;

    if ($uploadMax > 0 && $postMax > 0) {
        $effectiveMax = min($uploadMax, $postMax);
    } else {
        $effectiveMax = max($uploadMax, $postMax);
    }

    $limitText = $effectiveMax > 0 ? formatBytesToReadable($effectiveMax) : 'the server upload limit';

    switch ($fileError) {
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            return "File is too large. Please upload a smaller file (max {$limitText}).";
        case UPLOAD_ERR_PARTIAL:
            return 'Upload was interrupted. Please try again.';
        case UPLOAD_ERR_NO_FILE:
            return 'No file was uploaded.';
        case UPLOAD_ERR_NO_TMP_DIR:
            return 'Server upload folder is missing.';
        case UPLOAD_ERR_CANT_WRITE:
            return 'Server could not write the uploaded file.';
        case UPLOAD_ERR_EXTENSION:
            return 'Upload was blocked by a server extension.';
        default:
            return 'Upload failed. Please try again.';
    }
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Check Authorization Header
$token = JWT::getBearerToken();
$user = JWT::decode($token);

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Increase limits
ini_set('memory_limit', '256M');
ini_set('max_execution_time', 300);

try {
    // Check file
    if (!isset($_FILES['file'])) {
        throw new Exception('No file uploaded');
    }

    $file = $_FILES['file'];
    $type = $_POST['type'] ?? $_POST['folder'] ?? 'misc'; // music, image, video, album
    $fileName = $file['name'];
    $fileTmpName = $file['tmp_name'];
    $fileError = $file['error'];

    $allowedUploadTypes = ['music', 'image', 'video', 'album', 'covers', 'misc'];
    if (!in_array($type, $allowedUploadTypes, true)) {
        throw new Exception('Invalid upload type');
    }

    if ($fileError !== 0) {
        throw new Exception(getUploadErrorMessage($fileError), $fileError);
    }

    // Determine upload directory
    $uploadDir = '../uploads/' . $type . '/';
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0777, true)) {
            throw new Exception('Failed to create upload directory: ' . $uploadDir);
        }
    }

    // Sanitize filename
    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
    $fileBaseName = pathinfo($fileName, PATHINFO_FILENAME);
    $sanitizedBaseName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $fileBaseName);
    $sanitizedBaseName = trim($sanitizedBaseName, '_');
    if ($sanitizedBaseName === '') {
        $sanitizedBaseName = $type . '_' . date('Ymd_His');
    }

    if ($type === 'music') {
        $allowedMusicExtensions = ['mp3', 'wav'];
        if (!in_array($fileExt, $allowedMusicExtensions, true)) {
            throw new Exception('Unsupported music format. Please upload an MP3 or WAV file.');
        }

        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mimeType = $finfo ? finfo_file($finfo, $fileTmpName) : '';
            if ($finfo) {
                finfo_close($finfo);
            }

            $allowedMusicMimeTypes = [
                'audio/mpeg',
                'audio/mp3',
                'audio/wav',
                'audio/x-wav',
                'audio/wave',
                'audio/vnd.wave',
                'application/octet-stream',
            ];

            if ($mimeType && !in_array($mimeType, $allowedMusicMimeTypes, true)) {
                throw new Exception('Unsupported music format. Please upload an MP3 or WAV file.');
            }
        }
    }

    $newFileName = $sanitizedBaseName . '.' . $fileExt;

    // Check for duplicates
    $counter = 1;
    while (file_exists($uploadDir . $newFileName)) {
        $newFileName = $sanitizedBaseName . '_' . $counter . '.' . $fileExt;
        $counter++;
    }

    $fileDestination = $uploadDir . $newFileName;

    // Move file
    if (move_uploaded_file($fileTmpName, $fileDestination)) {

        // --- Image Optimization Logic ---
        // Feature flag to disable optimization if causing issues
        $allowOptimization = true;

        try {
            if ($allowOptimization && extension_loaded('gd') && in_array($fileExt, ['jpg', 'jpeg', 'png', 'webp'])) {
                $maxWidth = 1000;
                $quality = 80;

                // Get original dimensions
                list($width, $height) = getimagesize($fileDestination);

                // Only resize/convert if valid image and loaded
                if ($width) {
                    $newWidth = $width;
                    $newHeight = $height;

                    if ($width > $maxWidth) {
                        $newWidth = $maxWidth;
                        $newHeight = intval(($height / $width) * $newWidth);
                    }

                    $sourceImage = null;
                    if ($fileExt === 'jpg' || $fileExt === 'jpeg') {
                        $sourceImage = @imagecreatefromjpeg($fileDestination);
                    } elseif ($fileExt === 'png') {
                        $sourceImage = @imagecreatefrompng($fileDestination);
                    } elseif ($fileExt === 'webp') {
                        $sourceImage = @imagecreatefromwebp($fileDestination);
                    }

                    if ($sourceImage) {
                        $thumb = imagecreatetruecolor($newWidth, $newHeight);

                        // Preserve transparency
                        if ($fileExt === 'png' || $fileExt === 'webp') {
                            imagealphablending($thumb, false);
                            imagesavealpha($thumb, true);
                            $transparent = imagecolorallocatealpha($thumb, 255, 255, 255, 127);
                            imagefilledrectangle($thumb, 0, 0, $newWidth, $newHeight, $transparent);
                        }

                        imagecopyresampled($thumb, $sourceImage, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

                        // Save as WebP
                        $newFileNameWebP = pathinfo($newFileName, PATHINFO_FILENAME) . '.webp';
                        $fileDestinationWebP = $uploadDir . $newFileNameWebP;

                        if (imagewebp($thumb, $fileDestinationWebP, $quality)) {
                            // Only delete original if different extension
                            if ($fileDestination !== $fileDestinationWebP) {
                                unlink($fileDestination);
                            }
                            $newFileName = $newFileNameWebP;
                        }

                        imagedestroy($sourceImage);
                        imagedestroy($thumb);
                    }
                }
            }
        } catch (Exception $e) {
            // Log error but continue with original file
            error_log("Image optimization failed: " . $e->getMessage());
            file_put_contents('../uploads/error_log.txt', date('[Y-m-d H:i:s] ') . "Image optimization failed: " . $e->getMessage() . "\n", FILE_APPEND);
        }
        // --- End Image Optimization ---

        // Return public URL
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
        $host = $_SERVER['HTTP_HOST'];
        $publicUrl = "$protocol://$host/uploads/" . $type . '/' . $newFileName;

        echo json_encode([
            'success' => true,
            'url' => $publicUrl,
            'name' => $fileName
        ]);

    } else {
        throw new Exception("Failed to move uploaded file to destination: $fileDestination");
    }

} catch (Exception $e) {
    // Catch-all error handler
    error_log("Upload failed: " . $e->getMessage());
    file_put_contents('error_log.txt', date('[Y-m-d H:i:s] ') . "Upload failed: " . $e->getMessage() . "\n", FILE_APPEND);
    if (in_array($e->getCode(), [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)) {
        http_response_code(413);
    } else {
        http_response_code(500);
    }
    echo json_encode(['error' => $e->getMessage()]);
}
?>
