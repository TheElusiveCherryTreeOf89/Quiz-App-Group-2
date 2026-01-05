<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT 
                s.id,
                s.quiz_id,
                s.score,
                s.total_questions,
                s.violations,
                s.time_remaining,
                s.submitted_at,
                u.name as student_name,
                u.email as student_email,
                q.title as quiz_title,
                r.id as released
              FROM submissions s
              INNER JOIN users u ON s.student_id = u.id
              INNER JOIN quizzes q ON s.quiz_id = q.id
              LEFT JOIN results_released r ON q.id = r.quiz_id
              ORDER BY s.submitted_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $submissions = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $submissions[] = [
            "id" => intval($row['id']),
            "quizId" => intval($row['quiz_id']),
            "quizTitle" => $row['quiz_title'],
            "studentName" => $row['student_name'],
            "studentEmail" => $row['student_email'],
            "score" => intval($row['score']),
            "totalQuestions" => intval($row['total_questions']),
            "violations" => intval($row['violations']),
            "timeRemaining" => intval($row['time_remaining']),
            "submittedAt" => $row['submitted_at'],
            "resultsReleased" => !is_null($row['released'])
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "submissions" => $submissions
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch submissions: " . $e->getMessage()
    ]);
}
?>
