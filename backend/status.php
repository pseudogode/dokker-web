<?php
require_once __DIR__ . '/constants.php'; 
require_once __DIR__ . '/utils.php';

session_start();
header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    jsonResponse([
        'status' => SUCCESS,
        'user' => $_SESSION['user_id']
    ], 200);
} else {
    jsonResponse([
        'status' => ERROR,
    ], 401);
}
