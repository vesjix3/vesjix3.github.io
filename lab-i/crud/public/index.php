<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
$view = null;
switch ($action) {
    case 'post-index':
    case null:
        $controller = new Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (empty($_REQUEST['id'])) {
            break;
        }
        $controller = new Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (empty($_REQUEST['id'])) {
            break;
        }
        $controller = new Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (empty($_REQUEST['id'])) {
            break;
        }
        $controller = new Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'book-index':
        $controller = new \assets\src\Controller\BookController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'book-create':
        $controller = new \assets\src\Controller\BookController();
        $view = $controller->createAction($_REQUEST['book'] ?? null, $templating, $router);
        break;
    case 'book-edit':
        if (empty($_REQUEST['id'])) {
            break;
        }
        $controller = new \assets\src\Controller\BookController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['book'] ?? null, $templating, $router);
        break;
    case 'book-show':
        if (empty($_REQUEST['id'])) {
            break;
        }
        $controller = new \assets\src\Controller\BookController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'book-delete':
        if (empty($_REQUEST['id'])) {
            break;
        }
        $controller = new \assets\src\Controller\BookController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;
    case 'info':
        $controller = new Controller\InfoController();
        $view = $controller->infoAction();
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view !== null) {
    echo $view;
}
