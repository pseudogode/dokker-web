<?php
require_once __DIR__ . '/../../utils/constants.php'; 
require_once __DIR__ . '/../../utils/utils.php';

class DockerClient 
{
    private string $url;

    public function __construct() {
        $config = include __DIR__ . '/../../configurations/dockerConfig.php';

        $this->url = $config['url'];
    }

    public function getContainers(): array 
    {
        $response = file_get_contents("{$this->url}containers/json?all=true");

        if ($response === false) {
            throw new Exception("Failed to retrieve containers from Docker API");
        }

        $containers = json_decode($response, true);

        if (!is_array($containers)) {
            throw new Exception("Invalid JSON response from Docker API");
        }

        return $containers;
    }

    public function startContainer(string $containerId): bool 
    {
        return $this->sendDockerRequest($containerId, 'start');
    }

    public function stopContainer(string $containerId): bool 
    {
        return $this->sendDockerRequest($containerId, 'stop');
    }

    private function sendDockerRequest(string $containerId, string $action): bool 
    {
        $url = "{$this->url}/containers/{$containerId}/{$action}";
        $context = stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => 'Content-Type: application/json',
            ]
        ]);

        $response = file_get_contents($url, false, $context);
        return $response !== false;
    }
}
