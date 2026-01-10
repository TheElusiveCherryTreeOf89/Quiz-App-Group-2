<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Simple endpoint to assign students by email to an instructor (accepts JSON)
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);

if (!$input || !isset($input['instructor_id']) || !isset($input['emails']) || !is_array($input['emails'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Bad input, expected { instructor_id, emails: [] }']);
    exit();
}

$instructor_id = (int)$input['instructor_id'];
$emails = $input['emails'];

try {
    // Ensure instructor exists
    $q = $db->prepare('SELECT id FROM users WHERE id = :id AND role = "instructor" LIMIT 1');
    $q->execute([':id' => $instructor_id]);
    if ($q->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Instructor not found']);
        exit();
    }

    $updated = 0;
    $stmt = $db->prepare('UPDATE users SET instructor_id = :instructor_id WHERE email = :email AND role = "student"');
    foreach ($emails as $email) {
        $stmt->execute([':instructor_id' => $instructor_id, ':email' => $email]);
        $updated += $stmt->rowCount();
    }

    echo json_encode(['success' => true, 'updated' => $updated]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to assign students: ' . $e->getMessage()]);
}
