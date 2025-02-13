<?php

class Logger 
{
    public static function save(string $clasName, array $data): void
    {
        $fileName = $clasName . '.php\n';

        foreach ($data as $message) {
            file_put_contents($fileName, date("Y-m-d H:i:s") . '\n', FILE_APPEND);
            file_put_contents($fileName, $message, FILE_APPEND);
        }
        file_put_contents($fileName, '\n\n', FILE_APPEND);
    }
}
