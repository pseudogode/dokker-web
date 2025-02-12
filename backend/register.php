<?php
require_once __DIR__ . '/constants.php'; 
require_once __DIR__ . '/utils.php';

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    jsonResponse([
      'status' => ERROR,
      'message' => 'Method not allowed',
    ], 400);
}

$bodyJSON = file_get_contents('php://input');
$body = json_decode($bodyJSON, true);

if (!$body['email'] || !$body['username'] || !$body['password']) {
    jsonResponse([
        'status' => ERROR,
        'message' => 'Missing data',
    ], 400);
}

session_set_cookie_params([
    'lifetime' => TOKEN_VALID_TIME,
    'path' => '/', // Available across the whole site
    'domain' => '', // Default (useful for subdomains if needed)
    'secure' => true, // Only send over HTTPS
    'httponly' => true, // Prevent JavaScript access (XSS protection)
    'samesite' => 'Strict' // CSRF protection (or 'Lax' for more flexibility)
]);
session_start();

$connection = getDbConnection();

$email = trim($body['email']);
$username = trim($body['username']);
$password = trim($body['password']);
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$query = "INSERT INTO users (email, username, pass_hash) VALUES (?, ?, ?)";
$statement = $connection->prepare($query);
$statement->bind_param("sss", $email, $username, $hashedPassword);

try {
    if (! $statement->execute()) {
        jsonResponse([
            'status' => ERROR,
            "message" => "Error creating user"
        ], 500);
    }
} catch (mysqli_sql_exception $e) {
    // duplicate entry
    if ($e->getCode() == 1062) { 
        jsonResponse([
            'status' => ERROR,
            'message' => 'Username or email is taken'
        ], 400);
    } else {
        jsonResponse([
            'status' => ERROR,
            'message' => 'Something went wrong'
        ], 500);
    }
}

$_SESSION['user_id'] = $connection->insert_id;

$statement->close();
$connection->close();

jsonResponse([
    'status' => SUCCESS,
], 201);
