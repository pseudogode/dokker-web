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

if (hasActiveSession())
{
    jsonResponse([
        'status' => SUCCESS,
    ]);
}

$connection = getDbConnection();

$email = trim($body['email']);
$username = trim($body['username']);
$password = trim($body['password']);
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);

$query = "INSERT INTO users (email, username, pass_hash) VALUES (?, ?, ?)";
$statement = $connection->prepare($query);
$statement->bind_param("sss", $email, $username, $hashedPassword);

if (! $statement->execute()) {
    jsonResponse([
        'status' => ERROR,
        "message" => "Error creating user"
    ], 500);
}

$statement->close();
$connection->close();

jsonResponse([
    'status' => SUCCESS,
], 201);
