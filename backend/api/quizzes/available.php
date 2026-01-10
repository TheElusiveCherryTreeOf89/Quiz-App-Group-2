<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

try {
    $query = "SELECT q.id, q.title, q.description, q.questions, q.time_limit, q.due_date, q.items_count, q.published, q.created_by, u.name as instructor_name
              FROM quizzes q
              LEFT JOIN users u ON q.created_by = u.id
              WHERE q.published = 1
              ORDER BY q.due_date DESC";
    $stmt = $db->prepare($query);
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
            "itemsCount" => intval($row['items_count']),
            "published" => (bool)$row['published'],
            "instructorName" => $row['instructor_name'],
            "createdBy" => intval($row['created_by'])
        ];
    }

    http_response_code(200);
    echo json_encode(["success" => true, "quizzes" => $quizzes]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to fetch available quizzes: " . $e->getMessage()]);
}
