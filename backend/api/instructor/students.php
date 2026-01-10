<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Get token from Authorization header
$headers = getallheaders();
$debugLog = __DIR__ . '/../../auth_debug.log';
file_put_contents($debugLog, date('c') . " STUDENTS_HEADERS: " . json_encode($headers) . PHP_EOL, FILE_APPEND);
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

// Read optional body or query params to allow debugging/tools to request by id/email
$raw = file_get_contents('php://input');
$input = json_decode($raw, true) ?? [];

// Also accept GET query params
$qs = $_GET ?? [];

// Helper to get a param from input or querystring
$getParam = function($names) use ($input, $qs) {
    foreach ($names as $n) {
        if (isset($input[$n])) return $input[$n];
        if (isset($qs[$n])) return $qs[$n];
    }
    return null;
};

// If an instructor_id or email is provided in the request, prefer that (useful for debugging)
$overrideId = $getParam(['instructor_id','instructorId']);
$overrideEmail = $getParam(['instructor_email','instructorEmail']);
if ($overrideEmail && !$overrideId) {
    // lookup instructor id by email
    $q = $db->prepare('SELECT id FROM users WHERE email = :email AND role = "instructor" LIMIT 1');
    $q->execute([':email' => $overrideEmail]);
    $row = $q->fetch(PDO::FETCH_ASSOC);
    if ($row && isset($row['id'])) $overrideId = (int)$row['id'];
}
if ($overrideId) {
    $userId = (int)$overrideId;
}

try {
    // Ensure users.instructor_id exists (add column if missing)
    try {
        $db->query("DESCRIBE users instructor_id");
    } catch (Exception $colEx) {
        // add the column (nullable) so students can be linked to instructors
        $db->exec("ALTER TABLE users ADD COLUMN instructor_id INT NULL AFTER role");
    }
    // Include students either assigned to this instructor (users.instructor_id)
    // or who have submitted quizzes created by this instructor.
    $query = "SELECT
                u.id,
                u.name,
                u.email,
                COUNT(s.id) as quizzes_taken,
                COALESCE(AVG(s.score * 100.0 / NULLIF(s.total_questions,0)), 0) as average_score,
                MAX(s.submitted_at) as last_submission
              FROM users u
              LEFT JOIN submissions s ON u.id = s.student_id
              LEFT JOIN quizzes q ON s.quiz_id = q.id
              WHERE u.role = 'student' AND (
                q.created_by = :instructor_id OR u.instructor_id = :instructor_id
              )
              GROUP BY u.id, u.name, u.email
              ORDER BY u.name";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":instructor_id", $userId, PDO::PARAM_INT);
    $stmt->execute();

    $students = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $students[] = [
            "id" => intval($row['id']),
            "name" => $row['name'],
            "email" => $row['email'],
            "quizzesTaken" => intval($row['quizzes_taken']),
            "averageScore" => round(floatval($row['average_score']), 1),
            "lastSubmission" => $row['last_submission']
        ];
    }

    http_response_code(200);
    echo json_encode([
        "success" => true,
        "students" => $students
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to fetch students: " . $e->getMessage()
    ]);
}
?>