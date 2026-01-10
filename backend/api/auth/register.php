<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password) || empty($data->name)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email, password, and name are required"
    ]);
    exit();
}

// Default role to student if not specified
$role = isset($data->role) ? $data->role : 'student';

if (!in_array($role, ['student', 'instructor'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid role. Must be 'student' or 'instructor'"
    ]);
    exit();
}

try {
    // Check if email already exists
    $checkQuery = "SELECT id FROM users WHERE email = :email";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->bindParam(":email", $data->email);
    $checkStmt->execute();
    
    if ($checkStmt->rowCount() > 0) {
        http_response_code(409);
        echo json_encode([
            "success" => false,
            "message" => "Email already registered"
        ]);
        exit();
    }
    
    // Hash password
    $hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);
    
    // Optionally set instructor_id when provided (useful for linking students to instructors)
    $instructorId = null;
    if (isset($data->instructor_id)) $instructorId = (int)$data->instructor_id;

    // Insert new user (include instructor_id if present)
    if ($instructorId) {
        $query = "INSERT INTO users (email, password, name, role, instructor_id) VALUES (:email, :password, :name, :role, :instructor_id)";
    } else {
        $query = "INSERT INTO users (email, password, name, role) VALUES (:email, :password, :name, :role)";
    }
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->bindParam(":name", $data->name);
    $stmt->bindParam(":role", $role);
    if ($instructorId) $stmt->bindParam(":instructor_id", $instructorId, PDO::PARAM_INT);
    
    if ($stmt->execute()) {
        $userId = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Registration successful",
            "user" => [
                "id" => intval($userId),
                "name" => $data->name,
                "email" => $data->email,
                "role" => $role
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Registration failed"
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Registration failed: " . $e->getMessage()
    ]);
}
?>
