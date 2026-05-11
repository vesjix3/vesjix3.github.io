<?php
require_once __DIR__ . '/lib.php';

use App\Serializer;


$formats = array('csv' => 'CSV', 'ssv' => 'SSV (spacja)', 'tsv' => 'TSV (tab)', 'json' => 'JSON', 'yaml' => 'YAML');

$error = null;
$outputText = '';
$inputText = '';
$inputFormat = 'csv';
$outputFormat = 'json';


if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    if (!empty($_COOKIE['last_input'])) $inputText = $_COOKIE['last_input'];
    if (!empty($_COOKIE['last_in_format'])) $inputFormat = $_COOKIE['last_in_format'];
    if (!empty($_COOKIE['last_out_format'])) $outputFormat = $_COOKIE['last_out_format'];
} else {

    $inputText = isset($_POST['input']) ? $_POST['input'] : '';
    $inputFormat = isset($_POST['input_format']) ? $_POST['input_format'] : 'csv';
    $outputFormat = isset($_POST['output_format']) ? $_POST['output_format'] : 'json';


    setcookie('last_input', $inputText, time() + 30 * 24 * 3600, '/');
    setcookie('last_in_format', $inputFormat, time() + 30 * 24 * 3600, '/');
    setcookie('last_out_format', $outputFormat, time() + 30 * 24 * 3600, '/');

    try {

        if (strtolower($inputFormat) === strtolower($outputFormat)) {
            $outputText = $inputText;
        } else {
            $serializer = new Serializer();

            $data = $serializer->deserialize($inputFormat, $inputText);

            $outputText = $serializer->serialize($outputFormat, $data);
        }
    } catch (Exception $e) {
        $error = $e->getMessage();
    }
}

function h($s) { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }

?>
<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Konwerter formatów</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; font-size: 18px; }
        textarea { width: 100%; height: 400px; box-sizing: border-box; resize: vertical; font-size: 16px; }
        select, button { padding: 8px; font-size: 16px; }
        pre { background:white; padding:10px; border:1px solid black; white-space: pre-wrap; min-height: 400px; max-height: 800px; overflow-y: auto; box-sizing: border-box; font-size: 16px; }

        .row { margin-bottom: 15px; }
    </style>
</head>
<body>
    <h1>Konwerter formatów: CSV/SSV/TSV <-> JSON/YAML</h1>
    <?php if ($error): ?>
        <p class="error">Błąd: <?= h($error) ?></p>
    <?php endif; ?>

    <form method="post">
        <div class="row">
            <label for="input">Dane wejściowe:</label><br>
            <textarea id="input" name="input"><?= h($inputText) ?></textarea>
        </div>
        <div class="row">
            <label>Format wejściowy:
                <select name="input_format">
                    <?php foreach ($formats as $k => $label): ?>
                        <option value="<?= h($k) ?>" <?= $k === $inputFormat ? 'selected' : '' ?>><?= h($label) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>

            <label style="margin-left:20px;">Format wyjściowy:
                <select name="output_format">
                    <?php foreach ($formats as $k => $label): ?>
                        <option value="<?= h($k) ?>" <?= $k === $outputFormat ? 'selected' : '' ?>><?= h($label) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
        </div>
        <div class="row">
            <button type="submit">Konwertuj</button>
        </div>
    </form>

    <h2>Wynik:</h2>
    <pre id="output"><?= h($outputText) ?></pre>

</body>
</html>
