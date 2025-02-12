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

if (!$body['email'] || !$body['password']) {
    jsonResponse([
        'status' => ERROR,
        'message' => 'Missing data',
    ], 400);
}

session_start();

if (isset($_SESSION['user_id'])) {
    jsonResponse([
        'status' => SUCCESS,
    ]);
}

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
        'message' => 'Wrong password',
    ], 400);
}

$getUserStatement->close();
$connection->close();

jsonResponse([
    'status' => SUCCESS,
]);
