<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->student_id) || empty($data->quiz_id) || !isset($data->answers) || !isset($data->score)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit();
}

try {
    // Check if student already submitted this quiz
    $checkQuery = "SELECT id FROM submissions WHERE student_id = :student_id AND quiz_id = :quiz_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":student_id", $data->student_id, PDO::PARAM_INT);
    $checkStmt->bindParam(":quiz_id", $data->quiz_id, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "You have already submitted this quiz"
        ]);
        exit();
    }
    
    // Insert submission
    $query = "INSERT INTO submissions 
              (student_id, quiz_id, answers, score, total_questions, violations, time_remaining) 
              VALUES 
              (:student_id, :quiz_id, :answers, :score, :total_questions, :violations, :time_remaining)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":student_id", $data->student_id, PDO::PARAM_INT);
    $stmt->bindParam(":quiz_id", $data->quiz_id, PDO::PARAM_INT);
    $answersJson = json_encode($data->answers);
    $stmt->bindParam(":answers", $answersJson);
    $stmt->bindParam(":score", $data->score, PDO::PARAM_INT);
    $stmt->bindParam(":total_questions", $data->total_questions, PDO::PARAM_INT);
    $violations = isset($data->violations) ? $data->violations : 0;
    $stmt->bindParam(":violations", $violations, PDO::PARAM_INT);
    $timeRemaining = isset($data->time_remaining) ? $data->time_remaining : 0;
    $stmt->bindParam(":time_remaining", $timeRemaining, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        $submissionId = $db->lastInsertId();
        
        // Create notification for student
        $notifQuery = "INSERT INTO notifications (user_id, title, message, icon, color) 
                       VALUES (:user_id, :title, :message, :icon, :color)";
        $notifStmt = $db->prepare($notifQuery);
        $notifStmt->bindParam(":user_id", $data->student_id, PDO::PARAM_INT);
        $title = "Quiz Submitted";
        $message = "Your quiz has been submitted successfully. Results will be released by the instructor.";
        $icon = "✅";
        $color = "#22C55E";
        $notifStmt->bindParam(":title", $title);
        $notifStmt->bindParam(":message", $message);
        $notifStmt->bindParam(":icon", $icon);
        $notifStmt->bindParam(":color", $color);
        $notifStmt->execute();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Quiz submitted successfully",
            "submission_id" => intval($submissionId)
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to submit quiz"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Submission failed: " . $e->getMessage()
    ]);
}
?>
