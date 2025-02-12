<?php

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit();
}

function getDbConnection() {
    $config = include __DIR__ . '/configurations/DBconfig.php';

    $dbname = $config['dbname'];
    $usersTable = 'users';

    $connection = new mysqli($config['servername'], $config['username'], $config['password'], $config['dbname']);

    if ($connection->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }

    return $connection;
}

// function hasActiveSession(): bool 
// {
//     if (!getSessionIdFromHeader()) {
//         return false;
//     }

//     $connection = getDbConnection();
//     $tableName = 'sessions';
//     $prepStatement = $connection->prepare("SELECT id, expiry FROM $tableName WHERE token = ?");
//     $prepStatement->bind_param("s", $_REQUEST['token']);
//     $prepStatement->execute();

//     if ($prepStatement->num_rows == 0) {
//         return false;
//     }
    
//     $getUserStatement->bind_result($expiry);
//     $getUserStatement->fetch();

//     if ($expiry < time()) {
//         return false;
//     }

//     return true;
// }

// function validateSession(): void
// {
//     $token = $_REQUEST['token'] ?? null;
//     if (! $token) {
//         jsonResponse([
//             'status' => ERROR,
//             'message' => 'Missing token',
//         ], 401);
//     }

//     $connection = getDbConnection();
//     $tableName = 'sessions';
//     $prepStatement = $connection->prepare("SELECT id, expiry FROM $tableName WHERE token = ?");
//     $prepStatement->bind_param("s", $token);
//     $prepStatement->execute();

//     if ($prepStatement->num_rows == 0) {
//         jsonResponse([
//             'status' => ERROR,
//             'message' => 'Session not found',
//         ], 401);
//     }
    
//     $prepStatement->bind_result($expiry);
//     $prepStatement->fetch();

//     if ($expiry < time()) {
//         jsonResponse([
//             'status' => ERROR,
//             'message' => 'Session expired',
//         ], 401);
//     }

//     $newExpiry = time() + TOKEN_VALID_TIME;
//     $token = $_REQUEST['token'] ?? null;

//     $prepStatement = $connection->prepare("UPDATE $tableName SET expiry = ? WHERE token = ?");
//     $prepStatement->bind_param("is", $newExpiry, $token);
//     $prepStatement->execute();

//     if ($prepStatement->affected_rows == 0) {
//         //logger save log "Failed to update token expiry";
//     }

//     $prepStatement->close();
// }

// function getSessionIdFromHeader() {
//     $headers = getallheaders();
//     return $headers['X-Session-Id'] ?? null;
// }

// function generateSessionId($user_id): string
// {
//     $connection = getDbConnection();
//     $sessionId = generateUuidV4();
//     $expiry = time() + TOKEN_VALID_TIME;
    
//     $sessionsTable = 'sessions';
//     $statement = $connection->prepare("INSERT INTO $sessionsTable (user_id, token, expiry) VALUES (:user_id, :token, :expiry)");
//     $statement->execute(['user_id' => $userId, 'sessionId' => $sessionId, 'expiry' => $expiry]);
    
//     return $sessionId;
// }

// function generateUuidV4() {
//     return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
//         mt_rand(0, 0xffff), mt_rand(0, 0xffff),
//         mt_rand(0, 0xffff),
//         mt_rand(0, 0x0fff) | 0x4000,
//         mt_rand(0, 0x3fff) | 0x8000,
//         mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
//     );
// }
