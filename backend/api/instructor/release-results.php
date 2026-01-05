<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->quiz_id) || empty($data->instructor_id)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Quiz ID and Instructor ID are required"
    ]);
    exit();
}

try {
    // Check if already released
    $checkQuery = "SELECT id FROM results_released WHERE quiz_id = :quiz_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":quiz_id", $data->quiz_id, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Results already released for this quiz"
        ]);
        exit();
    }
    
    // Insert release record
    $query = "INSERT INTO results_released (quiz_id, released_by) VALUES (:quiz_id, :instructor_id)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":quiz_id", $data->quiz_id, PDO::PARAM_INT);
    $stmt->bindParam(":instructor_id", $data->instructor_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        // Get all students who submitted this quiz
        $studentsQuery = "SELECT DISTINCT student_id FROM submissions WHERE quiz_id = :quiz_id";
        $studentsStmt = $db->prepare($studentsQuery);
        $studentsStmt->bindParam(":quiz_id", $data->quiz_id, PDO::PARAM_INT);
        $studentsStmt->execute();
        
        // Create notifications for all students
        $notifQuery = "INSERT INTO notifications (user_id, title, message, icon, color) 
                       VALUES (:user_id, :title, :message, :icon, :color)";
        $notifStmt = $db->prepare($notifQuery);
        
        while ($student = $studentsStmt->fetch(PDO::FETCH_ASSOC)) {
            $notifStmt->bindParam(":user_id", $student['student_id'], PDO::PARAM_INT);
            $title = "Results Released";
            $message = "Your quiz results have been released! Check your results page.";
            $icon = "🎉";
            $color = "#22C55E";
            $notifStmt->bindParam(":title", $title);
            $notifStmt->bindParam(":message", $message);
            $notifStmt->bindParam(":icon", $icon);
            $notifStmt->bindParam(":color", $color);
            $notifStmt->execute();
        }
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Results released successfully"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to release results"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Release failed: " . $e->getMessage()
    ]);
}
?>
