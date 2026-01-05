<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$studentId = isset($_GET['student_id']) ? intval($_GET['student_id']) : 0;

if ($studentId === 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Student ID is required"
    ]);
    exit();
}

try {
    $query = "SELECT 
                s.id,
                s.quiz_id,
                s.score,
                s.total_questions,
                s.violations,
                s.time_remaining,
                s.submitted_at,
                q.title as quiz_title,
                q.time_limit,
                r.id as released
              FROM submissions s
              INNER JOIN quizzes q ON s.quiz_id = q.id
              LEFT JOIN results_released r ON q.id = r.quiz_id
              WHERE s.student_id = :student_id
              ORDER BY s.submitted_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":student_id", $studentId, PDO::PARAM_INT);
    $stmt->execute();
    
    $results = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $released = !is_null($row['released']);
        
        $results[] = [
            "id" => intval($row['id']),
            "quizId" => intval($row['quiz_id']),
            "quizTitle" => $row['quiz_title'],
            "score" => $released ? intval($row['score']) : null,
            "totalQuestions" => intval($row['total_questions']),
            "violations" => intval($row['violations']),
            "timeRemaining" => intval($row['time_remaining']),
            "timeLimit" => intval($row['time_limit']),
            "submittedAt" => $row['submitted_at'],
            "resultsReleased" => $released
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "results" => $results
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch results: " . $e->getMessage()
    ]);
}
?>
