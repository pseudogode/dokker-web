<?php
require_once __DIR__ . '/constants.php'; 
require_once __DIR__ . '/utils.php';

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    jsonResponse([
      'status' => ERROR,
      'message' => 'Method not allowed',
    ], 400);
}

if (!$_POST['username'] || !$_POST['password']) {
    jsonResponse([
        'status' => ERROR,
        'message' => 'Missing data',
    ], 400);
}

if (hasActiveSession())
{
    jsonResponse([
        'status' => SUCCESS,
        'sessionId' => $_POST['sessionId']
    ]);
}

$connection = getDbConnection();

$username = trim($_POST['username']);
$password = trim($_POST['password']);

$getUserStatement = $connection->prepare("SELECT id, password_hash FROM users WHERE username = ?");
$getUserStatement->bind_param("s", $username);
$getUserStatement->execute();
$getUserStatement->store_result();

if ($getUserStatement->num_rows == 0) {
    jsonResponse([
        'status' => ERROR,
        'message' => 'User not found',
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

$sessionId = generateSessionId();

jsonResponse([
    'status' => SUCCESS,
    'sessionId' => $sessionId,
]);
