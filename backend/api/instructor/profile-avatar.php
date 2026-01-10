<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get token from Authorization header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Authorization token required"
    ]);
    exit();
}

$token = $matches[1];

// For now, we'll decode the token to get user ID
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

$data = json_decode(file_get_contents("php://input"));

if (empty($data->avatar)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Avatar data is required"
    ]);
    exit();
}

try {
    // Update user avatar
    $query = "UPDATE users SET avatar = :avatar WHERE id = :id AND role = 'instructor'";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":avatar", $data->avatar);
    $stmt->bindParam(":id", $userId, PDO::PARAM_INT);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Avatar updated successfully",
            "avatar" => $data->avatar
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to update avatar"
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to update avatar: " . $e->getMessage()
    ]);
}
?>