<?php
require_once __DIR__ . '/../logger/Logger.php';

$config = include __DIR__ . '/../configurations/DBconfig.php';

$dbname = $config['dbname'];

$servername = getenv('DB_HOST') ?: 'db';   // Docker service name
$username   = 'root';                       // matches MYSQL_ROOT_PASSWORD
$password   = 'root';                       // matches MYSQL_ROOT_PASSWORD
$dbname     = $config['dbname'];

$connection = new mysqli($servername, $username, $password);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

if ($connection->connect_error) {
  die("Connection failed: " . $connection->connect_error);
}

$sql = "DROP DATABASE $dbname";
if ($connection->query($sql) === TRUE) {
  echo "Database $dbname dropped successfully" . PHP_EOL;
} else {
  Logger::save(__FILE__, [
  "Error dropping database:",
  $connection->error
]);
  Logger::save(__FILE__, "Error dropping database: ", $connection->error);
}
