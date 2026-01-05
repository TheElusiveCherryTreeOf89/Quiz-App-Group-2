<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->notification_id)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Notification ID is required"
    ]);
    exit();
}

try {
    $query = "UPDATE notifications SET is_read = 1 WHERE id = :notification_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":notification_id", $data->notification_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Notification marked as read"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to update notification"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Update failed: " . $e->getMessage()
    ]);
}
?>
