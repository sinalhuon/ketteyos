<?php
// Shared helpers for invitation OpenGraph metadata and preview images.

function og_table_columns($pdo, $table)
{
    static $cache = [];
    if (isset($cache[$table])) {
        return $cache[$table];
    }

    if (!preg_match('/^[A-Za-z0-9_]+$/', $table)) {
        return [];
    }

    try {
        $stmt = $pdo->query("SHOW COLUMNS FROM `$table`");
        $cols = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            if (!empty($row['Field'])) {
                $cols[$row['Field']] = true;
            }
        }
        $cache[$table] = $cols;
        return $cols;
    } catch (Throwable $e) {
        $cache[$table] = [];
        return [];
    }
}

function og_fetch_guest($pdo, $identifier, $eventId = '')
{
    $identifier = trim((string) $identifier);
    if ($identifier === '') {
        return null;
    }

    $cols = og_table_columns($pdo, 'Guest');
    $lookupCols = array_values(array_filter(['shortCode', 'token', 'id'], function ($field) use ($cols) {
        return isset($cols[$field]);
    }));

    if (empty($lookupCols)) {
        return null;
    }

    $conditions = [];
    $params = [];
    foreach ($lookupCols as $index => $field) {
        $param = 'code_' . $index;
        $conditions[] = "`$field` = :$param";
        $params[$param] = $identifier;
    }

    $sql = "SELECT * FROM Guest WHERE (" . implode(' OR ', $conditions) . ")";

    if ($eventId !== '' && isset($cols['eventId'])) {
        $sql .= " AND eventId = :eventId";
        $params['eventId'] = $eventId;
    }

    $sql .= " LIMIT 1";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $guest = $stmt->fetch(PDO::FETCH_ASSOC);
        return $guest ?: null;
    } catch (Throwable $e) {
        return null;
    }
}

function og_fetch_event($pdo, $identifier, $idOnly = false)
{
    $identifier = trim((string) $identifier);
    if ($identifier === '') {
        return null;
    }

    $eventCols = og_table_columns($pdo, 'Event');
    if (empty($eventCols) || !isset($eventCols['id'])) {
        return null;
    }

    $templateCols = og_table_columns($pdo, 'Template');
    $templateFields = [
        'name',
        'codeKey',
        'backgroundImageUrl',
        'introFrameUrl',
        'transitionFrameUrl',
        'detailFrameUrl',
        'buttonImageUrl',
        'guestFrameUrl',
        'templateConfig',
        'previewUrl',
        'backgroundVideoUrl',
        'introVideoUrl',
    ];

    $selectParts = ['e.*'];
    foreach ($templateFields as $field) {
        if (isset($templateCols[$field])) {
            $selectParts[] = "t.`$field` AS `t_$field`";
        }
    }

    $join = '';
    if (!empty($templateCols) && isset($eventCols['templateId'])) {
        $join = " LEFT JOIN Template t ON (e.templateId = t.id";
        if (isset($templateCols['codeKey'])) {
            $join .= " OR e.templateId = t.codeKey";
        }
        $join .= ")";
    }

    $where = ['e.id = :eventId'];
    $params = ['eventId' => $identifier];
    if (!$idOnly && isset($eventCols['slug'])) {
        $where[] = 'e.slug = :eventSlug';
        $params['eventSlug'] = $identifier;
    }

    try {
        $stmt = $pdo->prepare("SELECT " . implode(', ', $selectParts) . " FROM Event e" . $join . " WHERE (" . implode(' OR ', $where) . ") LIMIT 1");
        $stmt->execute($params);
        $event = $stmt->fetch(PDO::FETCH_ASSOC);
        return $event ? og_hydrate_event_assets($event) : null;
    } catch (Throwable $e) {
        try {
            $fallbackParams = ['eventId' => $identifier];
            $fallbackSql = "SELECT * FROM Event WHERE id = :eventId";
            if (!$idOnly && isset($eventCols['slug'])) {
                $fallbackSql .= " OR slug = :eventSlug";
                $fallbackParams['eventSlug'] = $identifier;
            }
            $fallbackSql .= " LIMIT 1";
            $stmt = $pdo->prepare($fallbackSql);
            $stmt->execute($fallbackParams);
            $event = $stmt->fetch(PDO::FETCH_ASSOC);
            return $event ? og_hydrate_event_assets($event) : null;
        } catch (Throwable $fallbackError) {
            return null;
        }
    }
}

function og_decode_json_array($value)
{
    if (is_array($value)) {
        return $value;
    }

    if (!is_string($value) || trim($value) === '') {
        return [];
    }

    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : [];
}

function og_hydrate_event_assets($event)
{
    foreach (['introFrameUrl', 'transitionFrameUrl', 'detailFrameUrl', 'backgroundImageUrl', 'buttonImageUrl', 'guestFrameUrl'] as $field) {
        $templateField = 't_' . $field;
        if (empty($event[$field]) && !empty($event[$templateField])) {
            $event[$field] = $event[$templateField];
        }
    }

    $baseConfig = og_decode_json_array($event['t_templateConfig'] ?? null);
    $eventConfig = og_decode_json_array($event['templateConfig'] ?? null);
    $event['ogTemplateConfig'] = array_replace_recursive($baseConfig, $eventConfig);

    return $event;
}

function og_template_config($event)
{
    if (isset($event['ogTemplateConfig']) && is_array($event['ogTemplateConfig'])) {
        return $event['ogTemplateConfig'];
    }

    return og_decode_json_array($event['templateConfig'] ?? null);
}

function og_is_movie_event($event)
{
    $type = strtolower(str_replace(['-', ' '], '_', (string) ($event['eventType'] ?? '')));
    $templateId = strtolower(str_replace(['-', ' '], '_', (string) ($event['templateId'] ?? '')));
    $templateName = strtolower(str_replace(['-', ' '], '_', (string) (($event['t_name'] ?? '') . ' ' . ($event['t_codeKey'] ?? ''))));
    $config = og_template_config($event);
    $layoutType = strtolower(str_replace(['-', ' '], '_', (string) ($config['layoutType'] ?? '')));

    return $type === 'movie_premiere'
        || strpos($type, 'movie') !== false
        || strpos($type, 'film') !== false
        || strpos($templateId, 'movie') !== false
        || strpos($templateId, 'film') !== false
        || strpos($templateName, 'movie') !== false
        || strpos($templateName, 'film') !== false
        || $layoutType === 'movie_ceremony';
}

function og_make_absolute_url($url, $baseUrl)
{
    $url = trim((string) $url);
    if ($url === '') {
        return '';
    }

    if (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0) {
        return $url;
    }

    if (strpos($url, '//') === 0) {
        $scheme = parse_url($baseUrl, PHP_URL_SCHEME) ?: 'https';
        return $scheme . ':' . $url;
    }

    if (strpos($url, 'data:') === 0) {
        return '';
    }

    return rtrim($baseUrl, '/') . '/' . ltrim($url, '/');
}

function og_guest_photo_url($guest)
{
    if (!$guest || !is_array($guest)) {
        return '';
    }

    $fields = [
        'photoUrl',
        'guestPhotoUrl',
        'avatarUrl',
        'profileImage',
        'profilePhotoUrl',
        'profilePhoto',
        'imageUrl',
        'thumbnailUrl',
        'photo',
        'avatar',
        'image',
        'picture',
    ];

    foreach ($fields as $field) {
        if (isset($guest[$field])) {
            $url = og_url_from_value($guest[$field]);
            if ($url !== '') {
                return $url;
            }
        }
    }

    foreach ($guest as $value) {
        $url = og_url_from_value($value);
        if ($url !== '') {
            return $url;
        }
    }

    return '';
}

function og_url_from_value($value, $depth = 0)
{
    if ($depth > 3 || $value === null) {
        return '';
    }

    if (is_string($value)) {
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        $first = substr($value, 0, 1);
        if ($first === '{' || $first === '[') {
            $decoded = json_decode($value, true);
            if (is_array($decoded)) {
                return og_url_from_value($decoded, $depth + 1);
            }
        }

        if (preg_match('/^(https?:)?\/\//i', $value) || strpos($value, '/') === 0 || strpos($value, 'uploads/') === 0) {
            return $value;
        }

        return '';
    }

    if (is_array($value)) {
        foreach (['url', 'src', 'href', 'photoUrl', 'imageUrl', 'avatarUrl', 'path'] as $field) {
            if (isset($value[$field])) {
                $url = og_url_from_value($value[$field], $depth + 1);
                if ($url !== '') {
                    return $url;
                }
            }
        }

        foreach ($value as $item) {
            $url = og_url_from_value($item, $depth + 1);
            if ($url !== '') {
                return $url;
            }
        }
    }

    return '';
}

function og_guest_cache_version($guest)
{
    if (!$guest || !is_array($guest)) {
        return '';
    }

    $photoUrl = og_guest_photo_url($guest);
    $updatedAt = (string) ($guest['updatedAt'] ?? ($guest['photoUpdatedAt'] ?? ''));
    if ($photoUrl === '' && trim($updatedAt) === '') {
        return '';
    }

    $versionSource = trim($photoUrl . '|' . $updatedAt);
    return $versionSource !== '' ? substr(md5($versionSource), 0, 12) : '';
}

function og_is_image_candidate($url)
{
    $path = strtolower((string) (parse_url((string) $url, PHP_URL_PATH) ?: $url));
    if ($path === '') {
        return false;
    }

    if (preg_match('/\.(mp4|mov|webm|ogg|m4v|mp3|wav|m4a|aac)$/i', $path)) {
        return false;
    }

    return preg_match('/\.(jpg|jpeg|png|webp|gif|avif|bmp)$/i', $path) === 1;
}

function og_is_share_image_candidate($url)
{
    $path = strtolower((string) (parse_url((string) $url, PHP_URL_PATH) ?: $url));
    if ($path === '') {
        return false;
    }

    return preg_match('/\.(mp4|mov|webm|ogg|m4v|mp3|wav|m4a|aac)$/i', $path) !== 1;
}

function og_first_image_url($candidates, $baseUrl, $rasterOnly = true)
{
    foreach ($candidates as $candidate) {
        $url = og_make_absolute_url($candidate, $baseUrl);
        $isUsable = $rasterOnly ? og_is_image_candidate($url) : og_is_share_image_candidate($url);
        if ($url !== '' && $isUsable) {
            return $url;
        }
    }

    return '';
}

function og_static_preview_image_url($event, $guest, $baseUrl, $includeGuestPhoto = true, $rasterOnly = false)
{
    $templateConfig = og_template_config($event);
    $candidates = [];

    if ($includeGuestPhoto) {
        $candidates[] = og_guest_photo_url($guest);
    }

    $candidates = array_merge($candidates, [
        $event['shareImageUrl'] ?? '',
        $event['introFrameUrl'] ?? '',
        $templateConfig['introFrameUrl'] ?? '',
        $event['backgroundImageUrl'] ?? '',
        $templateConfig['backgroundImageUrl'] ?? '',
        $event['t_previewUrl'] ?? '',
        $event['logoUrl'] ?? '',
        $templateConfig['productionLogoUrl'] ?? '',
    ]);

    return og_first_image_url($candidates, $baseUrl, $rasterOnly);
}

function og_build_dynamic_image_url($baseUrl, $event, $guestIdentifier = '', $guest = null)
{
    $params = [];
    $eventIdentifier = trim((string) ($event['slug'] ?? ''));
    if ($eventIdentifier !== '') {
        $params['slug'] = $eventIdentifier;
    } elseif (!empty($event['id'])) {
        $params['id'] = $event['id'];
    }

    $guestIdentifier = trim((string) $guestIdentifier);
    if ($guestIdentifier !== '') {
        $params['guest'] = $guestIdentifier;
    }

    if (!empty($event['updatedAt'])) {
        $timestamp = strtotime((string) $event['updatedAt']);
        $params['v'] = $timestamp ? (string) $timestamp : substr(md5((string) $event['updatedAt']), 0, 10);
    }

    $guestVersion = og_guest_cache_version($guest);
    if ($guestVersion !== '') {
        $params['gv'] = $guestVersion;
    }

    $params['ogv'] = 'movie-poster-original-size-v3';

    return rtrim($baseUrl, '/') . '/api/og_image.php?' . http_build_query($params);
}

function og_movie_poster_dimensions($event, $baseUrl, $maxWidth = 1200)
{
    $templateConfig = og_template_config($event);
    $posterUrl = og_first_image_url([
        $event['shareImageUrl'] ?? '',
        $event['introFrameUrl'] ?? '',
        $templateConfig['introFrameUrl'] ?? '',
        $event['backgroundImageUrl'] ?? '',
        $templateConfig['backgroundImageUrl'] ?? '',
        $event['t_previewUrl'] ?? '',
        $event['logoUrl'] ?? '',
    ], $baseUrl);

    $fallback = ['width' => 1200, 'height' => 630];
    if ($posterUrl === '') {
        return $fallback;
    }

    $localPath = og_public_file_for_url(og_make_absolute_url($posterUrl, $baseUrl), $baseUrl);
    if ($localPath === '' || !function_exists('getimagesize')) {
        return $fallback;
    }

    $size = @getimagesize($localPath);
    if (!$size || empty($size[0]) || empty($size[1])) {
        return $fallback;
    }

    $width = (int) $size[0];
    $height = (int) $size[1];
    if ($width > $maxWidth) {
        $height = (int) round($height * ($maxWidth / $width));
        $width = $maxWidth;
    }

    return [
        'width' => max(1, $width),
        'height' => max(1, $height),
    ];
}

function og_hosts_match($firstHost, $secondHost)
{
    $firstHost = strtolower(preg_replace('/^www\./i', '', trim((string) $firstHost)));
    $secondHost = strtolower(preg_replace('/^www\./i', '', trim((string) $secondHost)));

    return $firstHost !== '' && $secondHost !== '' && $firstHost === $secondHost;
}

function og_path_is_inside($path, $root)
{
    $path = realpath($path);
    $root = realpath($root);
    if (!$path || !$root) {
        return false;
    }

    $root = rtrim($root, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;
    return strpos($path . DIRECTORY_SEPARATOR, $root) === 0;
}

function og_public_file_for_url($url, $baseUrl)
{
    $url = trim((string) $url);
    if ($url === '') {
        return '';
    }

    $publicRoot = realpath(dirname(__DIR__));
    if (!$publicRoot) {
        return '';
    }

    $path = '';
    if (strpos($url, 'http://') === 0 || strpos($url, 'https://') === 0) {
        $urlHost = parse_url($url, PHP_URL_HOST);
        $baseHost = parse_url($baseUrl, PHP_URL_HOST);
        $urlPath = parse_url($url, PHP_URL_PATH) ?: '';
        $looksLikeLocalUpload = strpos(ltrim(rawurldecode($urlPath), '/'), 'uploads/') === 0;
        if ($urlHost && $baseHost && !og_hosts_match($urlHost, $baseHost) && !$looksLikeLocalUpload) {
            return '';
        }
        $path = $urlPath;
    } else {
        $path = parse_url($url, PHP_URL_PATH) ?: $url;
    }

    if ($path === '') {
        return '';
    }

    $relativePath = ltrim(rawurldecode($path), '/');
    $candidate = realpath($publicRoot . '/' . $relativePath);
    if (!$candidate || !is_file($candidate)) {
        return '';
    }

    $allowedRoots = [$publicRoot];
    $uploadsRoot = realpath($publicRoot . '/uploads');
    if ($uploadsRoot) {
        $allowedRoots[] = $uploadsRoot;
    }

    foreach ($allowedRoots as $root) {
        if (og_path_is_inside($candidate, $root)) {
            return $candidate;
        }
    }

    return '';
}

function og_load_local_image_resource($path)
{
    $extension = strtolower(pathinfo((string) $path, PATHINFO_EXTENSION));

    try {
        if (($extension === 'jpg' || $extension === 'jpeg') && function_exists('imagecreatefromjpeg')) {
            $image = @imagecreatefromjpeg($path);
            if ($image) {
                return $image;
            }
        }

        if ($extension === 'png' && function_exists('imagecreatefrompng')) {
            $image = @imagecreatefrompng($path);
            if ($image) {
                return $image;
            }
        }

        if ($extension === 'webp' && function_exists('imagecreatefromwebp')) {
            $image = @imagecreatefromwebp($path);
            if ($image) {
                return $image;
            }
        }

        if ($extension === 'gif' && function_exists('imagecreatefromgif')) {
            $image = @imagecreatefromgif($path);
            if ($image) {
                return $image;
            }
        }

        if ($extension === 'avif' && function_exists('imagecreatefromavif')) {
            $image = @imagecreatefromavif($path);
            if ($image) {
                return $image;
            }
        }

        $data = @file_get_contents($path);
        if ($data === false || $data === '') {
            return null;
        }

        $image = @imagecreatefromstring($data);
        return $image ?: null;
    } catch (Throwable $e) {
        return null;
    }
}

function og_fetch_remote_image_data($url)
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_CONNECTTIMEOUT => 4,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_USERAGENT => 'Ketteyos OpenGraph Image Generator',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => false,
        ]);
        $data = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if (is_string($data) && $data !== '' && ($status === 0 || ($status >= 200 && $status < 300))) {
            return $data;
        }
    }

    $context = stream_context_create([
        'http' => [
            'timeout' => 5,
            'user_agent' => 'Ketteyos OpenGraph Image Generator',
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ],
    ]);

    $data = @file_get_contents($url, false, $context);
    return ($data === false || $data === '') ? false : $data;
}

function og_load_image_resource($url, $baseUrl)
{
    $absoluteUrl = og_make_absolute_url($url, $baseUrl);
    if ($absoluteUrl === '' || !og_is_image_candidate($absoluteUrl)) {
        return null;
    }

    $localPath = og_public_file_for_url($absoluteUrl, $baseUrl);
    try {
        if ($localPath !== '') {
            return og_load_local_image_resource($localPath);
        } else {
            $data = og_fetch_remote_image_data($absoluteUrl);
        }

        if ($data === false || $data === '') {
            return null;
        }

        $image = @imagecreatefromstring($data);
        return $image ?: null;
    } catch (Throwable $e) {
        return null;
    }
}

function og_cover_copy($dest, $src, $dstX, $dstY, $dstW, $dstH, $focusY = 0.42)
{
    $srcW = imagesx($src);
    $srcH = imagesy($src);
    if ($srcW <= 0 || $srcH <= 0 || $dstW <= 0 || $dstH <= 0) {
        return;
    }

    $srcRatio = $srcW / $srcH;
    $dstRatio = $dstW / $dstH;

    if ($srcRatio > $dstRatio) {
        $cropH = $srcH;
        $cropW = (int) round($srcH * $dstRatio);
        $srcX = (int) round(($srcW - $cropW) / 2);
        $srcY = 0;
    } else {
        $cropW = $srcW;
        $cropH = (int) round($srcW / $dstRatio);
        $srcX = 0;
        $centerY = (int) round($srcH * max(0, min(1, $focusY)));
        $srcY = max(0, min($srcH - $cropH, (int) round($centerY - ($cropH / 2))));
    }

    imagecopyresampled($dest, $src, $dstX, $dstY, $srcX, $srcY, $dstW, $dstH, $cropW, $cropH);
}

function og_contain_copy($dest, $src, $dstX, $dstY, $dstW, $dstH)
{
    $srcW = imagesx($src);
    $srcH = imagesy($src);
    if ($srcW <= 0 || $srcH <= 0 || $dstW <= 0 || $dstH <= 0) {
        return ['x' => $dstX, 'y' => $dstY, 'w' => $dstW, 'h' => $dstH];
    }

    $scale = min($dstW / $srcW, $dstH / $srcH);
    $drawW = (int) round($srcW * $scale);
    $drawH = (int) round($srcH * $scale);
    $drawX = (int) round($dstX + (($dstW - $drawW) / 2));
    $drawY = (int) round($dstY + (($dstH - $drawH) / 2));

    imagecopyresampled($dest, $src, $drawX, $drawY, 0, 0, $drawW, $drawH, $srcW, $srcH);

    return ['x' => $drawX, 'y' => $drawY, 'w' => $drawW, 'h' => $drawH];
}

function og_rounded_rect($image, $x, $y, $w, $h, $r, $color)
{
    imagefilledrectangle($image, $x + $r, $y, $x + $w - $r, $y + $h, $color);
    imagefilledrectangle($image, $x, $y + $r, $x + $w, $y + $h - $r, $color);
    imagefilledellipse($image, $x + $r, $y + $r, $r * 2, $r * 2, $color);
    imagefilledellipse($image, $x + $w - $r, $y + $r, $r * 2, $r * 2, $color);
    imagefilledellipse($image, $x + $r, $y + $h - $r, $r * 2, $r * 2, $color);
    imagefilledellipse($image, $x + $w - $r, $y + $h - $r, $r * 2, $r * 2, $color);
}

function og_font_path($kind = 'body')
{
    $publicRoot = dirname(__DIR__);
    $candidates = $kind === 'heading'
        ? [
            $publicRoot . '/assets/fonts/Moulpali-Regular.ttf',
            $publicRoot . '/assets/fonts/Moul-Regular.ttf',
            $publicRoot . '/assets/fonts/KantumruyPro-Bold.ttf',
        ]
        : [
            $publicRoot . '/assets/fonts/KantumruyPro-Bold.ttf',
            $publicRoot . '/assets/fonts/KantumruyPro-SemiBold.ttf',
            $publicRoot . '/assets/fonts/KantumruyPro-Regular.ttf',
            $publicRoot . '/assets/fonts/Suwannaphum-Regular.ttf',
            $publicRoot . '/assets/fonts/Hanuman-VariableFont_wght.ttf',
        ];

    foreach ($candidates as $path) {
        if (is_file($path)) {
            return $path;
        }
    }

    return '';
}

function og_normalize_text($text)
{
    $text = (string) $text;
    if (class_exists('Normalizer')) {
        $normalized = Normalizer::normalize($text, Normalizer::FORM_C);
        if (is_string($normalized)) {
            return $normalized;
        }
    }

    return $text;
}

function og_text_width($text, $size, $font)
{
    $text = og_normalize_text($text);
    if ($font === '') {
        return strlen((string) $text) * $size * 0.55;
    }

    $box = imagettfbbox($size, 0, $font, (string) $text);
    return abs($box[2] - $box[0]);
}

function og_fit_text($text, $size, $font, $maxWidth)
{
    $text = trim(og_normalize_text($text));
    if ($text === '' || og_text_width($text, $size, $font) <= $maxWidth) {
        return $text;
    }

    $ellipsis = '...';
    while (mb_strlen($text, 'UTF-8') > 1 && og_text_width($text . $ellipsis, $size, $font) > $maxWidth) {
        $text = mb_substr($text, 0, mb_strlen($text, 'UTF-8') - 1, 'UTF-8');
    }

    return rtrim($text) . $ellipsis;
}

function og_draw_centered_text($image, $text, $size, $y, $color, $font, $maxWidth)
{
    $text = og_fit_text($text, $size, $font, $maxWidth);
    if ($text === '') {
        return;
    }

    $width = og_text_width($text, $size, $font);
    $x = (int) round((imagesx($image) - $width) / 2);
    if ($font !== '') {
        imagettftext($image, $size, 0, $x, $y, $color, $font, $text);
    } else {
        imagestring($image, 5, $x, $y - $size, $text, $color);
    }
}

function og_copy_circle_image($dest, $src, $cx, $cy, $diameter)
{
    $diameter = (int) $diameter;
    $avatar = imagecreatetruecolor($diameter, $diameter);
    imagealphablending($avatar, false);
    imagesavealpha($avatar, true);
    $transparent = imagecolorallocatealpha($avatar, 0, 0, 0, 127);
    imagefill($avatar, 0, 0, $transparent);

    og_cover_copy($avatar, $src, 0, 0, $diameter, $diameter, 0.34);

    $radius = $diameter / 2;
    for ($x = 0; $x < $diameter; $x++) {
        for ($y = 0; $y < $diameter; $y++) {
            $dx = $x - $radius;
            $dy = $y - $radius;
            if (($dx * $dx + $dy * $dy) > ($radius * $radius)) {
                imagesetpixel($avatar, $x, $y, $transparent);
            }
        }
    }

    imagecopy($dest, $avatar, (int) ($cx - $radius), (int) ($cy - $radius), 0, 0, $diameter, $diameter);
    imagedestroy($avatar);
}

function og_guest_initial($guestName)
{
    $guestName = trim(og_normalize_text($guestName));
    if ($guestName === '') {
        return 'K';
    }

    if (function_exists('grapheme_substr')) {
        $initial = grapheme_substr($guestName, 0, 1);
        return $initial !== false && $initial !== '' ? $initial : 'K';
    }

    if (function_exists('mb_substr')) {
        $initial = mb_substr($guestName, 0, 1, 'UTF-8');
        return $initial !== '' ? $initial : 'K';
    }

    return strtoupper(substr($guestName, 0, 1));
}

function og_draw_guest_photo_on_movie_poster($canvas, $guest, $baseUrl, $posterRect = null)
{
    $guestPhoto = og_guest_photo_url($guest);
    $avatar = $guestPhoto ? og_load_image_resource($guestPhoto, $baseUrl) : null;
    if (!$avatar) {
        return;
    }

    $canvasW = imagesx($canvas);
    $canvasH = imagesy($canvas);
    $rect = is_array($posterRect) ? $posterRect : ['x' => 0, 'y' => 0, 'w' => $canvasW, 'h' => $canvasH];
    
    // Scale guest photo to be smaller (approx 23% of container instead of 31%)
    $diameter = (int) round(min($rect['w'], $rect['h']) * 0.23);
    $diameter = max(86, min((int) round(min($canvasW, $canvasH) * 0.32), $diameter));
    
    // Position guest photo higher vertically (35% down instead of 42%)
    $centerX = (int) round($rect['x'] + ($rect['w'] * 0.72));
    $centerY = (int) round($rect['y'] + ($rect['h'] * 0.35));

    $shadow = imagecolorallocatealpha($canvas, 0, 0, 0, 54);
    $outer = imagecolorallocatealpha($canvas, 255, 255, 255, 28);
    $ring = imagecolorallocatealpha($canvas, 255, 255, 255, 8);
    $inner = imagecolorallocatealpha($canvas, 18, 18, 20, 42);

    imagefilledellipse($canvas, $centerX + 4, $centerY + 6, $diameter + 24, $diameter + 24, $shadow);
    imagefilledellipse($canvas, $centerX, $centerY, $diameter + 22, $diameter + 22, $outer);
    imagefilledellipse($canvas, $centerX, $centerY, $diameter + 14, $diameter + 14, $ring);
    imagefilledellipse($canvas, $centerX, $centerY, $diameter + 4, $diameter + 4, $inner);

    og_copy_circle_image($canvas, $avatar, $centerX, $centerY, $diameter);
    imagedestroy($avatar);

    // Draw guest name below guest photo, centered under the photo
    $guestName = is_array($guest) ? ($guest['name'] ?? $guest['guestName'] ?? '') : '';
    if ($guestName !== '') {
        $font = og_font_path('body');
        $fontSize = (int) round($diameter * 0.16);
        $fontSize = max(11, min(20, $fontSize));

        $pillW = (int) round($diameter * 1.55);
        $pillH = (int) round($fontSize * 2.3);
        $pillX = (int) round($centerX - ($pillW / 2));
        $pillY = (int) round($centerY + ($diameter / 2) + 12);

        $pillBg = imagecolorallocatealpha($canvas, 12, 12, 16, 45); // Glass dark pill
        $pillBorder = imagecolorallocatealpha($canvas, 255, 255, 255, 60);
        $textWhite = imagecolorallocate($canvas, 255, 255, 255);

        // Draw pill background & border
        og_rounded_rect($canvas, $pillX, $pillY, $pillW, $pillH, (int) ($pillH / 2), $pillBg);
        
        // Draw text inside pill centered horizontally under the photo center X
        $fittedText = og_fit_text($guestName, $fontSize, $font, $pillW - 16);
        if ($fittedText !== '') {
            $textWidth = og_text_width($fittedText, $fontSize, $font);
            $textX = (int) round($centerX - ($textWidth / 2));
            $textY = $pillY + (int) round(($pillH + $fontSize) / 2) - 2;
            if ($font !== '') {
                imagettftext($canvas, $fontSize, 0, $textX, $textY, $textWhite, $font, $fittedText);
            } else {
                imagestring($canvas, 5, $textX, $textY - $fontSize, $fittedText, $textWhite);
            }
        }
    }
}

function og_send_image_response($image)
{
    $contentType = 'image/png';
    ob_start();
    $ok = false;

    if (function_exists('imagejpeg')) {
        $contentType = 'image/jpeg';
        $ok = imagejpeg($image, null, 88);
    }

    $data = ob_get_clean();

    if (!$ok || $data === false || $data === '') {
        ob_start();
        $contentType = 'image/png';
        $ok = imagepng($image);
        $data = ob_get_clean();
    }

    if (!$ok || $data === false || $data === '') {
        return false;
    }

    header('Content-Type: ' . $contentType);
    header('Content-Length: ' . strlen($data));
    header('Cache-Control: public, max-age=86400');
    header('X-Content-Type-Options: nosniff');
    echo $data;

    return true;
}

function og_send_movie_front_page_image($event, $guest, $baseUrl)
{
    if (!function_exists('imagecreatetruecolor')) {
        return false;
    }

    $templateConfig = og_template_config($event);
    $backgroundUrl = og_first_image_url([
        $event['shareImageUrl'] ?? '',
        $event['introFrameUrl'] ?? '',
        $templateConfig['introFrameUrl'] ?? '',
        $event['backgroundImageUrl'] ?? '',
        $templateConfig['backgroundImageUrl'] ?? '',
        $event['t_previewUrl'] ?? '',
        $event['logoUrl'] ?? '',
    ], $baseUrl);

    $dimensions = og_movie_poster_dimensions($event, $baseUrl);
    $canvasW = (int) $dimensions['width'];
    $canvasH = (int) $dimensions['height'];
    $canvas = imagecreatetruecolor($canvasW, $canvasH);
    imagealphablending($canvas, true);
    imagesavealpha($canvas, true);

    $black = imagecolorallocate($canvas, 3, 3, 5);
    imagefill($canvas, 0, 0, $black);

    $background = $backgroundUrl ? og_load_image_resource($backgroundUrl, $baseUrl) : null;
    $posterRect = ['x' => 0, 'y' => 0, 'w' => $canvasW, 'h' => $canvasH];
    if ($background) {
        imagecopyresampled($canvas, $background, 0, 0, 0, 0, $canvasW, $canvasH, imagesx($background), imagesy($background));
        imagedestroy($background);
    } else {
        for ($y = 0; $y < $canvasH; $y++) {
            $ratio = $y / $canvasH;
            $r = (int) (18 + 40 * $ratio);
            $g = (int) (18 + 18 * $ratio);
            $b = (int) (22 + 8 * $ratio);
            imageline($canvas, 0, $y, $canvasW, $y, imagecolorallocate($canvas, $r, $g, $b));
        }
    }

    og_draw_guest_photo_on_movie_poster($canvas, $guest, $baseUrl, $posterRect);

    $sent = og_send_image_response($canvas);
    imagedestroy($canvas);
    return $sent;
}
