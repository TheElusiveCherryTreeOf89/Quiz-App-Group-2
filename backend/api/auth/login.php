<?php
require_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);
    exit();
}

try {
    $query = "SELECT id, email, password, name, role, bio, avatar FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":email", $data->email);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Verify password (supports both plain and hashed)
        $passwordValid = false;
        if (password_verify($data->password, $user['password'])) {
            $passwordValid = true;
        } elseif ($data->password === $user['password']) {
            // Fallback for plain text passwords (development only)
            $passwordValid = true;
        }
        
        if ($passwordValid) {
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "user" => [
                    "id" => intval($user['id']),
                    "name" => $user['name'],
                    "email" => $user['email'],
                    "role" => $user['role'],
                    "bio" => $user['bio'],
                    "avatar" => $user['avatar']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                "success" => false,
                "message" => "Invalid password"
            ]);
        }
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Login failed: " . $e->getMessage()
    ]);
}
?>
