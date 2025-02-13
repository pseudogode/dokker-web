<?php
require_once __DIR__ . '/../../utils/constants.php'; 
require_once __DIR__ . '/../../utils/utils.php';

if ($_SERVER["REQUEST_METHOD"] != "GET") {
    jsonResponse([
      'status' => ERROR,
      'message' => 'Method not allowed',
    ], 400);
}

$bodyJSON = file_get_contents('php://input');
$body = json_decode($bodyJSON, true);

if (!$body['email'] || !$body['password']) {
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
$password = trim($body['password']);

$getUserStatement = $connection->prepare("SELECT id, pass_hash FROM users WHERE email = ?");
$getUserStatement->bind_param("s", $email);
$getUserStatement->execute();
$getUserStatement->store_result();

if ($getUserStatement->num_rows == 0) {
    jsonResponse([
        'status' => ERROR,
        'message' => 'Invalid credentials',
    ], 400);
}

$getUserStatement->bind_result($user_id, $stored_hash);
$getUserStatement->fetch();

if (! password_verify($password, $stored_hash)) {
    jsonResponse([
        'status' => ERROR,
        'message' => 'Invalid credentials',
    ], 400);
}

$_SESSION['user_id'] = $user_id;

$getUserStatement->close();
$connection->close();

jsonResponse([
    'status' => SUCCESS,
]);
