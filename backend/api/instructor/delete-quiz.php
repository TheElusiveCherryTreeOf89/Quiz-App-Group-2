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
    // Verify instructor owns this quiz
    $checkQuery = "SELECT id FROM quizzes WHERE id = :quiz_id AND created_by = :instructor_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":quiz_id", $data->quiz_id, PDO::PARAM_INT);
    $checkStmt->bindParam(":instructor_id", $data->instructor_id, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Quiz not found or you don't have permission to delete it"
        ]);
        exit();
    }
    
    // Check if quiz has submissions
    $submissionsQuery = "SELECT COUNT(*) as count FROM submissions WHERE quiz_id = :quiz_id";
    $submissionsStmt = $db->prepare($submissionsQuery);
    $submissionsStmt->bindParam(":quiz_id", $data->quiz_id, PDO::PARAM_INT);
    $submissionsStmt->execute();
    $submissionsCount = $submissionsStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    if ($submissionsCount > 0) {
        // Optional: Prevent deletion if there are submissions
        // Uncomment below if you want to block deletion
        /*
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Cannot delete quiz with existing submissions ($submissionsCount submissions found)"
        ]);
        exit();
        */
    }
    
    // Delete quiz (CASCADE will delete related submissions and results_released)
    $query = "DELETE FROM quizzes WHERE id = :quiz_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":quiz_id", $data->quiz_id, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Quiz deleted successfully",
            "submissions_deleted" => intval($submissionsCount)
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to delete quiz"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Deletion failed: " . $e->getMessage()
    ]);
}
?>
