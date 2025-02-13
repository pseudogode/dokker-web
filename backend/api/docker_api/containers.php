<?php
require_once __DIR__ . '/../../utils/constants.php'; 
require_once __DIR__ . '/../../utils/utils.php';
require_once __DIR__ . '/DockerClient.php';

$dockerClient = new DockerClient();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    getContainers($dockerClient);
}

$bodyJSON = file_get_contents('php://input');
$body = json_decode($bodyJSON, true);

if (!isset($body['containerId']) || !isset($body['operation'])) {
    jsonResponse([
        'status' => ERROR,
        'message' => 'Missing data',
    ], 400);
}
$containerId = $requestData['containerId'];
$operation = $requestData['operation'];
$userId = $_SESSION['user_id'];
$connection = getDbConnection();

function getContainers($dockerClient)
{
    $result = $dockerClient->getContainers();

    jsonResponse([
        'status' => SUCCESS,
        'containers' => $result,
    ]);
}

function getContainerById($connection, $containerId, $userId) {
    $sql = "SELECT * FROM containers WHERE container_id = ? AND user_id = ?";
    $statement = $connection->prepare($sql);
    $statement->bind_param("si", $containerId, $userId);
    $statement->execute();
    $result = $statement->get_result();
    $container = $result->fetch_assoc();

    return $container ?: null;
}

$container = getContainerById($connection, $containerId, $userId);
// if (!$container) {
//     die(json_encode(["error" => "Container not found"]));
// }

switch ($operation) {
    case "start":
        $dockerClient->startContainer($containerId);
        break;

    case "stop":
        $dockerClient->stopContainer($containerId);
        break;

    case "delete":
        //
        break;

    default:
        jsonResponse([
            'status' => ERROR,
            'message' => 'Invalid operation',
        ], 400);
}




