<?php

namespace App;

use \RuntimeException;

class Serializer
{
    private $encoders = array();

    public function __construct()
    {
        $this->register(new CsvEncoder(","));
        $this->register(new CsvEncoder(" "));
        $this->register(new CsvEncoder("\t"));
        $this->register(new JsonEncoder());
        $this->register(new YamlEncoder());
    }

    public function register(EncoderInterface $enc)
    {
        $this->encoders[] = $enc;
    }

    private function findDecoder($format)
    {
        foreach ($this->encoders as $e) {
            if ($e->supports($format)) return $e;
        }
        return null;
    }

    private function findEncoder($format)
    {
        return $this->findDecoder($format);
    }

    public function deserialize($format, $input)
    {
        $enc = $this->findDecoder($format);
        if ($enc === null) throw new RuntimeException('Unsupported input format: ' . $format);
        return $enc->decode($input);
    }

    public function serialize($format, $data)
    {
        $enc = $this->findEncoder($format);
        if ($enc === null) throw new RuntimeException('Unsupported output format: ' . $format);
        return $enc->encode($data);
    }
}
