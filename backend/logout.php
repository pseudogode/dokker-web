<?php
require_once __DIR__ . '/constants.php'; 
require_once __DIR__ . '/utils.php';

if ($_SERVER["REQUEST_METHOD"] != "POST") {
    jsonResponse([
      'status' => ERROR,
      'message' => 'Method not allowed',
    ], 400);
}

session_start();
$_SESSION = [];
session_destroy();

if (isset($_COOKIE[session_name()])) {
    setcookie(session_name(), '', time() - TOKEN_VALID_TIME, '/'); // manual expire
}

jsonResponse([
    'status' => SUCCESS,
]);
