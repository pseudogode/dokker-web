<?php
require_once __DIR__ . '/../../utils/constants.php'; 
require_once __DIR__ . '/../../utils/utils.php';
require_once __DIR__ . '/DockerClient.php';

if ($_SERVER["REQUEST_METHOD"] != "GET") {
    jsonResponse([
      'status' => ERROR,
      'message' => 'Method not allowed',
    ], 400);
}

// session_start();
// if (!isset($_SESSION['user_id'])) {
//     jsonResponse([
//         'status' => ERROR,
//         'message' => 'Not logged in',
//     ], 401);
// }

$dockerClient = new DockerClient();

$result = $dockerClient->getContainers();

jsonResponse([
    'status' => SUCCESS,
    'containers' => $result,
]);


