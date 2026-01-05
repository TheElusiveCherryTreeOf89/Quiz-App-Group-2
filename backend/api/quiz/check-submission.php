<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$studentId = isset($_GET['student_id']) ? intval($_GET['student_id']) : 0;
$quizId = isset($_GET['quiz_id']) ? intval($_GET['quiz_id']) : 0;

if ($studentId === 0 || $quizId === 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Student ID and Quiz ID are required"
    ]);
    exit();
}

try {
    $query = "SELECT id, score, submitted_at FROM submissions 
              WHERE student_id = :student_id AND quiz_id = :quiz_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":student_id", $studentId, PDO::PARAM_INT);
    $stmt->bindParam(":quiz_id", $quizId, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $submission = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Check if results are released
        $releaseQuery = "SELECT id FROM results_released WHERE quiz_id = :quiz_id";
        $releaseStmt = $db->prepare($releaseQuery);
        $releaseStmt->bindParam(":quiz_id", $quizId, PDO::PARAM_INT);
        $releaseStmt->execute();
        $released = $releaseStmt->rowCount() > 0;
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "submitted" => true,
            "results_released" => $released,
            "submission" => [
                "id" => intval($submission['id']),
                "score" => $released ? intval($submission['score']) : null,
                "submitted_at" => $submission['submitted_at']
            ]
        ]);
    } else {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "submitted" => false
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Check failed: " . $e->getMessage()
    ]);
}
?>
