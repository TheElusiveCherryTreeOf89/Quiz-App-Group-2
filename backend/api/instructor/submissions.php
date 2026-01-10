<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get token from Authorization header
$headers = getallheaders();
$debugLog = __DIR__ . '/../../auth_debug.log';
file_put_contents($debugLog, date('c') . " SUBMISSIONS_HEADERS: " . json_encode($headers) . PHP_EOL, FILE_APPEND);
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader) || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Authorization token required",
        "received_headers" => $headers
    ]);
    exit();
}

$token = $matches[1];

// For now, we'll decode the token to get user ID
// In a real implementation, you'd validate the JWT token
$userData = json_decode(base64_decode($token), true);
if (!$userData || !isset($userData['id'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Invalid token - could not decode user data"
    ]);
    exit();
}

$userId = $userData['id'];

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
              WHERE q.created_by = $userId
              ORDER BY s.submitted_at DESC";

    $stmt = $db->query($query);

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
