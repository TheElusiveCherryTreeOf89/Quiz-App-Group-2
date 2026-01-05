<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->title) || empty($data->instructor_id) || empty($data->questions)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Title, instructor ID, and questions are required"
    ]);
    exit();
}

// Validate questions array
if (!is_array($data->questions) || count($data->questions) === 0) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Quiz must have at least one question"
    ]);
    exit();
}

// Set defaults
$timeLimit = isset($data->timeLimit) ? intval($data->timeLimit) : 1800; // 30 minutes default
$description = isset($data->description) ? $data->description : '';
$passingScore = isset($data->passingScore) ? intval($data->passingScore) : 70;
$maxViolations = isset($data->maxViolations) ? intval($data->maxViolations) : 3;
$shuffleQuestions = isset($data->shuffleQuestions) ? (bool)$data->shuffleQuestions : false;
$shuffleOptions = isset($data->shuffleOptions) ? (bool)$data->shuffleOptions : false;
$dueDate = isset($data->dueDate) ? $data->dueDate : null;
$attemptsAllowed = isset($data->attemptsAllowed) ? intval($data->attemptsAllowed) : 1;
$published = isset($data->published) ? (bool)$data->published : false;

try {
    // Encode questions as JSON
    $questionsJson = json_encode($data->questions);
    $itemsCount = count($data->questions);
    
    // Insert quiz
    $query = "INSERT INTO quizzes 
              (title, description, questions, time_limit, due_date, attempts_allowed, items_count, created_by, passing_score, max_violations, shuffle_questions, shuffle_options, published) 
              VALUES 
              (:title, :description, :questions, :time_limit, :due_date, :attempts_allowed, :items_count, :created_by, :passing_score, :max_violations, :shuffle_questions, :shuffle_options, :published)";
    
    $stmt = $db->prepare($query);
    $stmt->bindParam(":title", $data->title);
    $stmt->bindParam(":description", $description);
    $stmt->bindParam(":questions", $questionsJson);
    $stmt->bindParam(":time_limit", $timeLimit, PDO::PARAM_INT);
    $stmt->bindParam(":due_date", $dueDate);
    $stmt->bindParam(":attempts_allowed", $attemptsAllowed, PDO::PARAM_INT);
    $stmt->bindParam(":items_count", $itemsCount, PDO::PARAM_INT);
    $stmt->bindParam(":created_by", $data->instructor_id, PDO::PARAM_INT);
    $stmt->bindParam(":passing_score", $passingScore, PDO::PARAM_INT);
    $stmt->bindParam(":max_violations", $maxViolations, PDO::PARAM_INT);
    $stmt->bindParam(":shuffle_questions", $shuffleQuestions, PDO::PARAM_BOOL);
    $stmt->bindParam(":shuffle_options", $shuffleOptions, PDO::PARAM_BOOL);
    $stmt->bindParam(":published", $published, PDO::PARAM_BOOL);
    
    if ($stmt->execute()) {
        $quizId = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Quiz created successfully",
            "quiz_id" => intval($quizId),
            "quiz" => [
                "id" => intval($quizId),
                "title" => $data->title,
                "description" => $description,
                "timeLimit" => $timeLimit,
                "itemsCount" => $itemsCount,
                "published" => $published
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Failed to create quiz"
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Quiz creation failed: " . $e->getMessage()
    ]);
}
?>
