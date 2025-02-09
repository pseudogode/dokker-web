<?php

    echo "API is working!";

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405); // Method Not Allowed
        echo json_encode(["error" => "Only GET requests are allowed"]);
        exit();
    }

    if (!isset($_GET['id']) || empty($_GET['id'])) {
        http_response_code(400);
        echo json_encode(["error" => "Missing or empty 'id' parameter"]);
        exit();
    }

    $id = htmlspecialchars($_GET['id']);

    $data = [
        "id" => $id,
        "message" => "Data retrieved successfully"
    ];

    header("Content-Type: application/json");
    echo json_encode($data);




    // echo json_encode(["name" => "Sasho", "age" => 23]);

    // var_dump($_GET);

    // $person = json_decode(file_get_contents("php://input"), true);

    // echo json_encode($person);

?>