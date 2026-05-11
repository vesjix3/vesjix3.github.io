<?php

namespace App;

use \RuntimeException;

class JsonEncoder implements EncoderInterface
{
    public function supports($format)
    {
        return strtolower($format) === 'json';
    }

    public function decode($input)
    {
        $data = json_decode($input, true);
        if ($data === null && json_last_error() !== JSON_ERROR_NONE) {
            throw new RuntimeException('Błąd parsowania JSON: ' . json_last_error_msg());
        }
        if (!is_array($data)) {
            throw new RuntimeException('JSON musi reprezentować tablicę obiektów');
        }
        if (array_keys($data) !== range(0, count($data) - 1)) {
            $data = array($data);
        }
        foreach ($data as $item) {
            if (!is_array($item)) throw new RuntimeException('Każdy element JSON musi być obiektem');
        }
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
        return json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
}
