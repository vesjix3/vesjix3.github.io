<?php

namespace App;

class CsvEncoder implements EncoderInterface
{
    private $delimiter;

    public function __construct($delimiter = ",")
    {
        $this->delimiter = $delimiter;
    }

    public function supports($format)
    {
        $format = strtolower($format);
        if ($this->delimiter === "," && $format === 'csv') return true;
        if ($this->delimiter === " " && $format === 'ssv') return true;
        if ($this->delimiter === "\t" && $format === 'tsv') return true;
        return false;
    }

    public function decode($input)
    {
        $lines = preg_split("/\r\n|\r|\n/", trim($input));
        $rows = array();
        foreach ($lines as $line) {
            if ($line === '') continue;
            $rows[] = str_getcsv($line, $this->delimiter, '"', '\\');
        }
        if (count($rows) === 0) return array();
        $header = array_map('trim', $rows[0]);
        $result = array();
        for ($i = 1; $i < count($rows); $i++) {
            $r = $rows[$i];
            if (count($r) < count($header)) {
                $r = array_merge($r, array_fill(0, count($header) - count($r), null));
            }
            $assoc = array();
            for ($j = 0; $j < count($header); $j++) {
                $key = $header[$j];
                $assoc[$key] = isset($r[$j]) ? $r[$j] : null;
            }
            $result[] = $assoc;
        }
        return $result;
    }

    public function encode($data)
    {
        if (count($data) === 0) return "";
        $headers = array_keys((array)$data[0]);
        $fh = fopen('php://temp', 'r+');

        fputcsv($fh, $headers, $this->delimiter, '"', '\\');
        foreach ($data as $row) {
            $fields = array();
            foreach ($headers as $h) {
                $fields[] = isset($row[$h]) ? $row[$h] : '';
            }

            fputcsv($fh, $fields, $this->delimiter, '"', '\\');
        }
        rewind($fh);
        $out = stream_get_contents($fh);
        fclose($fh);
        return $out;
    }
}
