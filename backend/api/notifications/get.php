<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;

if ($userId === 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);
    exit();
}

try {
    $query = "SELECT id, title, message, icon, color, is_read, created_at 
              FROM notifications 
              WHERE user_id = :user_id 
              ORDER BY created_at DESC 
              LIMIT 50";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $userId, PDO::PARAM_INT);
    $stmt->execute();
    
    $notifications = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $notifications[] = [
            "id" => intval($row['id']),
            "title" => $row['title'],
            "message" => $row['message'],
            "icon" => $row['icon'],
            "color" => $row['color'],
            "isRead" => (bool)$row['is_read'],
            "time" => $row['created_at']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "notifications" => $notifications
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch notifications: " . $e->getMessage()
    ]);
}
?>
