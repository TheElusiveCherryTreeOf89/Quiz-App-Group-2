<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get token from Authorization header
$headers = getallheaders();
$debugLog = __DIR__ . '/../../auth_debug.log';
file_put_contents($debugLog, date('c') . " ANALYTICS_HEADERS: " . json_encode($headers) . PHP_EOL, FILE_APPEND);
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
$userData = json_decode(base64_decode($token), true);
if (!$userData || !isset($userData['id'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Invalid token"
    ]);
    exit();
}

$userId = $userData['id'];

try {
    // Get total quizzes created by this instructor
    $quizzesQuery = "SELECT COUNT(*) as total_quizzes FROM quizzes WHERE created_by = :instructor_id";
    $quizzesStmt = $db->prepare($quizzesQuery);
    $quizzesStmt->bindParam(":instructor_id", $userId, PDO::PARAM_INT);
    $quizzesStmt->execute();
    $quizzesCount = $quizzesStmt->fetch(PDO::FETCH_ASSOC)['total_quizzes'];

    // Get total submissions
    $submissionsQuery = "SELECT COUNT(*) as total_submissions FROM submissions s
                        INNER JOIN quizzes q ON s.quiz_id = q.id
                        WHERE q.created_by = :instructor_id";
    $submissionsStmt = $db->prepare($submissionsQuery);
    $submissionsStmt->bindParam(":instructor_id", $userId, PDO::PARAM_INT);
    $submissionsStmt->execute();
    $submissionsCount = $submissionsStmt->fetch(PDO::FETCH_ASSOC)['total_submissions'];

    // Get average score
    $avgScoreQuery = "SELECT AVG(s.score * 100.0 / s.total_questions) as avg_score FROM submissions s
                     INNER JOIN quizzes q ON s.quiz_id = q.id
                     WHERE q.created_by = :instructor_id";
    $avgScoreStmt = $db->prepare($avgScoreQuery);
    $avgScoreStmt->bindParam(":instructor_id", $userId, PDO::PARAM_INT);
    $avgScoreStmt->execute();
    $avgScore = $avgScoreStmt->fetch(PDO::FETCH_ASSOC)['avg_score'];

    // Get total students
    $studentsQuery = "SELECT COUNT(DISTINCT s.student_id) as total_students FROM submissions s
                     INNER JOIN quizzes q ON s.quiz_id = q.id
                     WHERE q.created_by = :instructor_id";
    $studentsStmt = $db->prepare($studentsQuery);
    $studentsStmt->bindParam(":instructor_id", $userId, PDO::PARAM_INT);
    $studentsStmt->execute();
    $studentsCount = $studentsStmt->fetch(PDO::FETCH_ASSOC)['total_students'];

    // Get quiz performance data (last 30 days)
    $performanceQuery = "SELECT DATE(s.submitted_at) as date, AVG(s.score * 100.0 / s.total_questions) as avg_score
                        FROM submissions s
                        INNER JOIN quizzes q ON s.quiz_id = q.id
                        WHERE q.created_by = :instructor_id AND s.submitted_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                        GROUP BY DATE(s.submitted_at)
                        ORDER BY date";
    $performanceStmt = $db->prepare($performanceQuery);
    $performanceStmt->bindParam(":instructor_id", $userId, PDO::PARAM_INT);
    $performanceStmt->execute();
    $performanceData = $performanceStmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "analytics" => [
            "totalQuizzes" => intval($quizzesCount),
            "totalSubmissions" => intval($submissionsCount),
            "averageScore" => round(floatval($avgScore ?: 0), 1),
            "totalStudents" => intval($studentsCount),
            "performanceData" => array_map(function($item) {
                return [
                    "date" => $item['date'],
                    "score" => round(floatval($item['avg_score']), 1)
                ];
            }, $performanceData)
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch analytics: " . $e->getMessage()
    ]);
}
?>