<?php

namespace App;

use \RuntimeException;

class YamlEncoder implements EncoderInterface
{
    public function supports($format)
    {
        return strtolower($format) === 'yaml' || strtolower($format) === 'yml';
    }

    public function decode($input)
    {
        if (!function_exists('yaml_parse')) {
            throw new RuntimeException('Brak rozszerzenia YAML w PHP');
        }
        $data = yaml_parse($input);
        if ($data === false) throw new RuntimeException('Błąd parsowania YAML');
        if (!is_array($data)) throw new RuntimeException('YAML musi reprezentować listę obiektów');
        if (array_keys($data) !== range(0, count($data) - 1)) $data = array($data);
        foreach ($data as $item) if (!is_array($item)) throw new RuntimeException('Każdy element YAML musi być obiektem');
        $this->assertSameKeys($data);
        return $data;
    }

    private function assertSameKeys($data)
    {
        if (count($data) === 0) return;
        $keys = array_keys($data[0]);
        sort($keys);
        foreach ($data as $item) {
            $k = array_keys($item);
            sort($k);
            if ($k !== $keys) throw new RuntimeException('Wszystkie elementy muszą mieć identyczne klucze');
        }
    }

    public function encode($data)
    {
        if (!function_exists('yaml_emit')) {
            throw new RuntimeException('Brak rozszerzenia YAML w PHP');
        }
        return yaml_emit($data);
    }
}
