<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Book;
use App\Service\Router;
use App\Service\Templating;

class BookController
{
	public function indexAction(Templating $templating, Router $router): ?string
	{
		$books = Book::findAll();
		return $templating->render('book/index.html.php', [
			'books' => $books,
			'router' => $router,
		]);
	}

	public function createAction(?array $requestPost, Templating $templating, Router $router): ?string
	{
		if ($requestPost) {
			$book = Book::fromArray($requestPost);
			//=@todo missing validation
			$book->save();

			$router->redirect($router->generatePath('book-index'));
			return null;
		}

		$book = new Book();

		return $templating->render('book/create.html.php', [
			'book' => $book,
			'router' => $router,
		]);
	}

	public function editAction(int $bookId, ?array $requestPost, Templating $templating, Router $router): ?string
	{
		$book = Book::find($bookId);
		if (! $book) {
			throw new NotFoundException("Missing book with id $bookId");
		}

		if ($requestPost) {
			$book->fill($requestPost);
			// @todo missing validation
			$book->save();

			$router->redirect($router->generatePath('book-index'));
			return null;
		}

		return $templating->render('book/edit.html.php', [
			'book' => $book,
			'router' => $router,
		]);
	}

	public function showAction(int $bookId, Templating $templating, Router $router): ?string
	{
		$book = Book::find($bookId);
		if (! $book) {
			throw new NotFoundException("Missing book with id $bookId");
		}

		return $templating->render('book/show.html.php', [
			'book' => $book,
			'router' => $router,
		]);
	}

	public function deleteAction(int $bookId, Router $router): ?string
	{
		$book = Book::find($bookId);
		if (! $book) {
			throw new NotFoundException("Missing book with id $bookId");
		}

		$book->delete();
		$router->redirect($router->generatePath('book-index'));

		return null;
	}
}

