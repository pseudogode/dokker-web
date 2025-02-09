<?php

require_once '../logger/Logger.php';

$config = include '../configurations/DBconfig.php';

$dbname = $config['dbname'];
$usersTable = 'users';

$connection = new mysqli($config['servername'], $config['username'], $config['password']);

// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($connection->query($sql) !== TRUE) {
    Logger::save(__FILE__, "Error creating database: " . $connection->error);
}

$connection->select_db($dbname);

$table_sql = "CREATE TABLE IF NOT EXISTS $usersTable (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    pass_hash VARCHAR(255) NOT NULL
)";
if ($connection->query($table_sql) === TRUE) {
    echo "Table $usersTable created successfully" . PHP_EOL;
} else {
    echo "Error creating table $usersTable: " . $connection->error . PHP_EOL;
}

$connection->close();
?>
