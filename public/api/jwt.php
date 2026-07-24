<?php
require_once 'db.php';

class JWT
{
    private static $secret_key = 'CHANGE_THIS_SECRET_KEY_ON_SERVER';
    private static $algorithm = 'HS256';

    public static function encode($payload)
    {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret_key, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function decode($jwt)
    {
        global $pdo;
        
        $tokenParts = explode('.', $jwt);
        if (count($tokenParts) != 3)
            return null;

        $header = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[0]));
        $payload = base64_decode(str_replace(['-', '_'], ['+', '/'], $tokenParts[1]));
        $signature_provided = $tokenParts[2];

        // Verify Signature
        $signature = hash_hmac('sha256', $tokenParts[0] . "." . $tokenParts[1], self::$secret_key, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        if ($base64UrlSignature === $signature_provided) {
            $decodedPayload = json_decode($payload, true);
            
            // Check if user still exists and has valid status in database
            if ($decodedPayload && isset($decodedPayload['id']) && $pdo) {
                try {
                    $stmt = $pdo->prepare("SELECT id, status FROM User WHERE id = :id");
                    $stmt->execute(['id' => $decodedPayload['id']]);
                    $user = $stmt->fetch();
                    
                    if (!$user) {
                        // User no longer exists
                        return null;
                    }
                    
                    // Check if user status allows login
                    $allowedStatuses = ['ACTIVE', 'APPROVED'];
                    if (!in_array($user['status'], $allowedStatuses)) {
                        // User status is not active (INACTIVE, SUSPENDED, PENDING, etc.)
                        return null;
                    }
                } catch (Exception $e) {
                    // If database check fails, still allow the token
                    // This prevents breaking the app if DB is temporarily unavailable
                }
            }
            
            return $decodedPayload;
        }
        return null;
    }

    public static function getBearerToken()
    {
        $headers = null;
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER["Authorization"]);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
            $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
        } elseif (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            // Server-side fix for bug in old Android versions (a nice side-effect of this fix potentially)
            $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }

        // Use basic getallheaders fallback if available
        if (!$headers && function_exists('getallheaders')) {
            $all = getallheaders();
            if (isset($all['Authorization'])) {
                $headers = trim($all['Authorization']);
            }
        }

        // HEADER: Get the access token from the header
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }

        // FALLBACK: Check Cookies (session or token)
        if (isset($_COOKIE['session'])) {
            return $_COOKIE['session'];
        }
        if (isset($_COOKIE['token'])) {
            return $_COOKIE['token'];
        }

        // FALLBACK: Check query param (sometimes used for images/downloads)
        if (isset($_GET['token'])) {
            return $_GET['token'];
        }

        return null;
    }
}