<?php

namespace App;

interface EncoderInterface
{
    public function supports($format);
    public function decode($input);
    public function encode($data);
}
