<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"), true);

// Allow instructor id from body or from Authorization token
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
$tokenUserId = null;
if (!empty($authHeader) && preg_match('/Bearer\s+(.*)$/i', $authHeader, $m)) {
    $t = $m[1];
    $u = @json_decode(base64_decode($t), true);
    if ($u && isset($u['id'])) $tokenUserId = (int)$u['id'];
}

$quizId = isset($data['quiz_id']) ? (int)$data['quiz_id'] : 0;
$instructorId = isset($data['instructor_id']) ? (int)$data['instructor_id'] : $tokenUserId;

if ($quizId === 0 || !$instructorId) {
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
    $checkStmt->bindParam(":quiz_id", $quizId, PDO::PARAM_INT);
    $checkStmt->bindParam(":instructor_id", $instructorId, PDO::PARAM_INT);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() === 0) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Quiz not found or you don't have permission to edit it"
        ]);
        exit();
    }
    
    // Build dynamic update query
    $updates = [];
    $params = [":quiz_id" => $quizId];
    
    if (isset($data['title'])) {
        $updates[] = "title = :title";
        $params[":title"] = $data['title'];
    }
    
    if (isset($data['description'])) {
        $updates[] = "description = :description";
        $params[":description"] = $data['description'];
    }
    
    if (isset($data['questions'])) {
        $updates[] = "questions = :questions";
        $updates[] = "items_count = :items_count";
        $params[":questions"] = json_encode($data['questions']);
        $params[":items_count"] = count($data['questions']);
    }
    
    if (isset($data['timeLimit'])) {
        $updates[] = "time_limit = :time_limit";
        $params[":time_limit"] = intval($data['timeLimit']);
    }
    
    if (isset($data['dueDate'])) {
        $updates[] = "due_date = :due_date";
        $params[":due_date"] = $data['dueDate'];
    }
    
    if (isset($data['attemptsAllowed'])) {
        $updates[] = "attempts_allowed = :attempts_allowed";
        $params[":attempts_allowed"] = intval($data['attemptsAllowed']);
    }
    
    if (isset($data['passingScore'])) {
        $updates[] = "passing_score = :passing_score";
        $params[":passing_score"] = intval($data['passingScore']);
    }
    
    if (isset($data['maxViolations'])) {
        $updates[] = "max_violations = :max_violations";
        $params[":max_violations"] = intval($data['maxViolations']);
    }
    
    if (isset($data['shuffleQuestions'])) {
        $updates[] = "shuffle_questions = :shuffle_questions";
        $params[":shuffle_questions"] = (bool)$data['shuffleQuestions'];
    }
    
    if (isset($data['shuffleOptions'])) {
        $updates[] = "shuffle_options = :shuffle_options";
        $params[":shuffle_options"] = (bool)$data['shuffleOptions'];
    }
    
    if (isset($data['published'])) {
        $updates[] = "published = :published";
        $params[":published"] = (bool)$data['published'];
    }
    
    if (empty($updates)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "No fields to update"
        ]);
        exit();
    }
    
    $query = "UPDATE quizzes SET " . implode(", ", $updates) . " WHERE id = :quiz_id";
    $stmt = $db->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    if ($stmt->execute()) {
        // Fetch updated quiz and return it
        $q = $db->prepare('SELECT * FROM quizzes WHERE id = :quiz_id LIMIT 1');
        $q->execute([':quiz_id' => $quizId]);
        $updated = $q->fetch(PDO::FETCH_ASSOC);
        if ($updated) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "quiz" => [
                    "id" => intval($updated['id']),
                    "title" => $updated['title'],
                    "description" => $updated['description'],
                    "questions" => json_decode($updated['questions']),
                    "published" => (bool)$updated['published']
                ]
            ]);
        } else {
            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Quiz updated successfully"]);
        }
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to update quiz"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Update failed: " . $e->getMessage()
    ]);
}
?>
