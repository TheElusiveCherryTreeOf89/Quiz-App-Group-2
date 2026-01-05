<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT 
                q.id,
                q.title,
                q.description,
                q.time_limit,
                q.due_date,
                q.attempts_allowed,
                q.items_count,
                q.created_at,
                u.name as instructor_name
              FROM quizzes q
              LEFT JOIN users u ON q.created_by = u.id
              ORDER BY q.due_date DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $quizzes = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $quizzes[] = [
            "id" => intval($row['id']),
            "title" => $row['title'],
            "description" => $row['description'],
            "timeLimit" => intval($row['time_limit']),
            "dueDate" => $row['due_date'],
            "attemptsAllowed" => intval($row['attempts_allowed']),
            "items" => intval($row['items_count']),
            "instructorName" => $row['instructor_name'],
            "createdAt" => $row['created_at']
        ];
    }
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "quizzes" => $quizzes
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch quizzes: " . $e->getMessage()
    ]);
}
?>
