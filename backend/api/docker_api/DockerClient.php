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

    public function getContainerById(string $containerId): ?array
    {
        $response = file_get_contents("{$this->url}containers/{$containerId}/json");

        if ($response === false) {
            return null;
        }

        $container = json_decode($response, true);

        return $container;
    }

    public function startContainer(string $containerId): bool 
    {
        return $this->sendDockerRequest($containerId, 'start');
    }

    public function stopContainer(string $containerId): bool 
    {
        return $this->sendDockerRequest($containerId, 'stop');
    }

    public function createContainerFromCommand(string $dockerRunCommand): ?array
    {
        $commandParts = $this->parseDockerRunCommand($dockerRunCommand);

        $containerConfig = [
            'Image' => $commandParts['image'],
            'ExposedPorts' => $commandParts['exposedPorts'],
            'HostConfig' => [
                'PortBindings' => $commandParts['portBindings'],
                'Binds' => $commandParts['binds']
            ],
            'Name' => $commandParts['name']
        ];

        $url = "{$this->url}containers/create";
        return $this->sendDockerRequestCreate($url, $containerConfig);
    }

    private function parseDockerRunCommand(string $dockerRunCommand): array
    {
        // Dummy parsing logic (you can expand this)
        $parts = preg_split('/\s+/', $dockerRunCommand);

        // Example: extracting image name and ports
        $image = $parts[count($parts) - 1]; 
        $name = str_replace('--name', '', $parts[array_search('--name', $parts) + 1]);

        $ports = [];
        $binds = [];
        $exposedPorts = [];

        // Extract ports and binds (rudimentary example)
        foreach ($parts as $key => $part) {
            if (strpos($part, '-p') === 0) {
                $port = explode(':', str_replace('-p', '', $part));
                $exposedPorts[$port[1] . '/tcp'] = new stdClass();
                $ports[$port[0]] = $port[1];
            } elseif (strpos($part, '-v') === 0) {
                // Volume binding
                $binds[] = str_replace('-v', '', $part);
            }
        }

        return [
            'image' => $image,
            'name' => $name,
            'exposedPorts' => $exposedPorts,
            'portBindings' => $ports,
            'binds' => $binds
        ];
    }

    private function sendDockerRequest(string $containerId, string $action): bool 
    {
        $url = "{$this->url}containers/{$containerId}/{$action}";
        $context = stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => 'Content-Type: application/json',
            ]
        ]);

        $response = file_get_contents($url, false, $context);
        return $response !== false;
    }

    private function sendDockerRequestCreate(string $url, array $data): ?array
    {
        $context = stream_context_create([
            'http' => [
                'method'  => 'POST',
                'header'  => 'Content-Type: application/json',
                'content' => json_encode($data)
            ]
        ]);

        $response = file_get_contents($url, false, $context);

        if ($response === false) {
            return null;
        }

        return json_decode($response, true);
    }
}
