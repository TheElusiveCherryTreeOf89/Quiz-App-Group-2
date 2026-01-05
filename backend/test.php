<?php
// Simple test to verify PHP and database connection work
echo "<h1>Quiz API Test Page</h1>";
echo "<p>✅ PHP is working!</p>";

// Test database connection
try {
    $conn = new PDO("mysql:host=localhost", "root", "");
    echo "<p>✅ MySQL connection successful!</p>";
    
    // Check if database exists
    $result = $conn->query("SHOW DATABASES LIKE 'quiz_app'");
    if ($result->rowCount() > 0) {
        echo "<p>✅ Database 'quiz_app' exists!</p>";
    } else {
        echo "<p>⚠️ Database 'quiz_app' not found - run schema.sql first!</p>";
    }
    
    $conn = null;
} catch(PDOException $e) {
    echo "<p>❌ Database error: " . $e->getMessage() . "</p>";
}

echo "<hr>";
echo "<h2>Quick Start:</h2>";
echo "<ol>";
echo "<li>Make sure Apache and MySQL are running in XAMPP</li>";
echo "<li>Open phpMyAdmin: <a href='http://localhost/phpmyadmin' target='_blank'>http://localhost/phpmyadmin</a></li>";
echo "<li>Run the SQL from: <code>C:\\xampp\\htdocs\\quiz-api\\database\\schema.sql</code></li>";
echo "<li>Test login API: <a href='http://localhost/quiz-api/api/auth/login.php'>login.php</a></li>";
echo "</ol>";

echo "<hr>";
echo "<h2>API Endpoints:</h2>";
echo "<ul>";
echo "<li><a href='api/quiz/get-quizzes.php'>GET /api/quiz/get-quizzes.php</a></li>";
echo "<li>POST /api/auth/login.php</li>";
echo "<li>POST /api/auth/register.php</li>";
echo "<li>POST /api/quiz/submit.php</li>";
echo "</ul>";
?>
