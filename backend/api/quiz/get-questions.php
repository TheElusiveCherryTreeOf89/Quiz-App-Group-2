<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get quiz ID from query parameter
$quizId = isset($_GET['quiz_id']) ? intval($_GET['quiz_id']) : 0;

if ($quizId === 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Quiz ID is required"
    ]);
    exit();
}

try {
    $query = "SELECT id, title, questions, time_limit, items_count FROM quizzes WHERE id = :quiz_id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":quiz_id", $quizId, PDO::PARAM_INT);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $quiz = $stmt->fetch(PDO::FETCH_ASSOC);
        
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "quiz" => [
                "id" => intval($quiz['id']),
                "title" => $quiz['title'],
                "questions" => json_decode($quiz['questions']),
                "timeLimit" => intval($quiz['time_limit']),
                "itemsCount" => intval($quiz['items_count'])
            ]
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "Quiz not found"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch quiz: " . $e->getMessage()
    ]);
}
?>
