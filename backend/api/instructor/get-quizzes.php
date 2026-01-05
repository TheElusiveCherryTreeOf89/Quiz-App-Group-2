<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$instructorId = isset($_GET['instructor_id']) ? intval($_GET['instructor_id']) : 0;

if ($instructorId === 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Instructor ID is required"
    ]);
    exit();
}

try {
    $query = "SELECT 
                q.id,
                q.title,
                q.description,
                q.questions,
                q.time_limit,
                q.due_date,
                q.attempts_allowed,
                q.items_count,
                q.passing_score,
                q.max_violations,
                q.shuffle_questions,
                q.shuffle_options,
                q.published,
                q.created_at,
                q.updated_at,
                (SELECT COUNT(*) FROM submissions WHERE quiz_id = q.id) as submissions_count
              FROM quizzes q
              WHERE q.created_by = :instructor_id
              ORDER BY q.created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":instructor_id", $instructorId, PDO::PARAM_INT);
    $stmt->execute();
    
    $quizzes = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $quizzes[] = [
            "id" => intval($row['id']),
            "title" => $row['title'],
            "description" => $row['description'],
            "questions" => json_decode($row['questions']),
            "timeLimit" => intval($row['time_limit']),
            "dueDate" => $row['due_date'],
            "attemptsAllowed" => intval($row['attempts_allowed']),
            "items" => intval($row['items_count']),
            "passingScore" => intval($row['passing_score']),
            "maxViolations" => intval($row['max_violations']),
            "shuffleQuestions" => (bool)$row['shuffle_questions'],
            "shuffleOptions" => (bool)$row['shuffle_options'],
            "published" => (bool)$row['published'],
            "createdAt" => $row['created_at'],
            "updatedAt" => $row['updated_at'],
            "submissionsCount" => intval($row['submissions_count'])
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "quizzes" => $quizzes,
        "total" => count($quizzes)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch quizzes: " . $e->getMessage()
    ]);
}
?>
