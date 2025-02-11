<?php

require_once __DIR__ . '/../logger/Logger.php';

$config = include __DIR__ . '/../configurations/DBconfig.php';

$dbname = $config['dbname'];

$connection = new mysqli($config['servername'], $config['username'], $config['password']);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($connection->query($sql) === TRUE) {
    echo "Database $dbname created successfully" . PHP_EOL; 
} else {
    Logger::save(__FILE__, "Error creating database: " . $connection->error);
}
$connection->select_db($dbname);

// create users
$usersTable = 'users';
$table_sql = "CREATE TABLE IF NOT EXISTS $usersTable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    pass_hash VARCHAR(255) NOT NULL
)";
if ($connection->query($table_sql) === TRUE) {
    echo "Table $usersTable created successfully" . PHP_EOL;
} else {
    echo "Error creating table $usersTable: " . $connection->error . PHP_EOL;
}

// create sessions
$sessionsTable = 'sessions';
$table_sql = "CREATE TABLE IF NOT EXISTS $sessionsTable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_id VARCHAR(100) NOT NULL UNIQUE,
    expiry INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES $usersTable(id) ON DELETE CASCADE
)";
if ($connection->query($table_sql) === TRUE) {
    echo "Table $sessionsTable created successfully" . PHP_EOL;
} else {
    echo "Error creating table $sessionsTable: " . $connection->error . PHP_EOL;
}

$connection->close();
?>
