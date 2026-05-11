<?php
spl_autoload_register(function ($class) {

    $prefix = 'App\\';
    $baseDir = __DIR__.'/lib/';

    if (0 === strpos($class, $prefix)) {

        $relative = substr($class, strlen($prefix));
        $file = $baseDir.str_replace('\\', '/', $relative).'.php';

        if (file_exists($file)) {
            require $file;
        }
    }
});
