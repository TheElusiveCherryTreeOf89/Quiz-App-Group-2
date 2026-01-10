<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get token from Authorization header
$headers = getallheaders();
$debugLog = __DIR__ . '/../../auth_debug.log';
file_put_contents($debugLog, date('c') . " PROFILE_HEADERS: " . json_encode($headers) . PHP_EOL, FILE_APPEND);
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Authorization token required",
        "received_headers" => $headers
    ]);
    exit();
}

$token = $matches[1];

// For now, we'll decode the token to get user ID
// In a real implementation, you'd validate the JWT token
$userData = json_decode(base64_decode($token), true);
if (!$userData || !isset($userData['id'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Invalid token"
    ]);
    exit();
}

$userId = $userData['id'];

try {
    $query = "SELECT id, name, email, bio, avatar FROM users WHERE id = :id AND role = 'instructor'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $userId, PDO::PARAM_INT);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "profile" => [
                "id" => intval($user['id']),
                "name" => $user['name'],
                "email" => $user['email'],
                "bio" => $user['bio'] ?: "Dedicated educator passionate about student success.",
                "avatar" => $user['avatar'],
                "employeeId" => "EMP-2024-" . str_pad($user['id'], 3, '0', STR_PAD_LEFT),
                "department" => "Computer Science",
                "title" => "Professor"
            ]
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Instructor not found"
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch profile: " . $e->getMessage()
    ]);
}
?>