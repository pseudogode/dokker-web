<?php
require_once __DIR__ . '/../../utils/constants.php'; 
require_once __DIR__ . '/../../utils/utils.php';
require_once __DIR__ . '/DockerClient.php';

session_start();
$dockerClient = new DockerClient();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET['containerId'])) {
        getContainerById($dockerClient, $_GET['containerId']);
    } else {
        getContainers($dockerClient);
    }
}

$bodyJSON = file_get_contents('php://input');
$body = json_decode($bodyJSON, true);

if (!isset($body['containerId']) || !isset($body['operation'])) {
    jsonResponse([
        'status' => ERROR,
        'message' => 'Missing data',
    ], 400);
}

if (isset($body['containerId']) && isset($body['operation']) && $body['operation'] == "start") {

    $dockerClient->startContainer($body['containerId']);
    jsonResponse([
        'status' => SUCCESS,
    ]);
}

if (isset($body['containerId']) && isset($body['operation']) && $body['operation'] == "stop") {

    $dockerClient->stopContainer($body['containerId']);
    jsonResponse([
        'status' => SUCCESS,
    ]);
}

if (isset($body['operation']) && $body['operation'] == "create") {

    $dockerClient->createContainer($containerId);
    jsonResponse([
        'status' => SUCCESS,
    ]);
}


function getContainers($dockerClient)
{
    $result = $dockerClient->getContainers();

    //filter by owned containers

    jsonResponse([
        'status' => SUCCESS,
        'containers' => $result,
    ]);
}

function getContainerById($dockerClient, $containerId)
{
    $container = $dockerClient->getContainerById($containerId);

    if (!$container) {
        jsonResponse([
            'status' => ERROR,
            'message' => 'Container not found',
        ], 404);
    }

    jsonResponse([
        'status' => SUCCESS,
        'container' => $container,
    ]);
}

function getContainerByIdAndOwner($connection, $containerId, $userId) {
    $sql = "SELECT * FROM containers WHERE container_id = ? AND user_id = ?";
    $statement = $connection->prepare($sql);
    $statement->bind_param("si", $containerId, $userId);
    $statement->execute();
    $result = $statement->get_result();
    $container = $result->fetch_assoc();

    return $container ?: null;
}

$userId = $_SESSION['user_id'];
$connection = getDbConnection();

$container = getContainerByIdAndOwner($connection, $containerId, $userId);
// if (!$container) {
//     die(json_encode(["error" => "Container not found"]));
// }


