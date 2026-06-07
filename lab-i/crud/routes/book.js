var express = require('express');
var router = express.Router();
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const db = new DatabaseSync(path.resolve(__dirname, '..', 'data.db'));

db.exec(`
    CREATE TABLE IF NOT EXISTS book (
                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                        title TEXT NOT NULL,
                                        author TEXT NOT NULL,
                                        description TEXT NOT NULL
    )
`);

router.get('/', (req, res) => {
    const books = db.prepare('SELECT * FROM book ORDER BY id DESC').all();
    res.render('book/index', { title: 'Book List', bodyClass: 'index', books });
});

router.get('/create', (req, res) => {
    res.render('book/create', {
        title: 'Create Book',
        bodyClass: 'edit',
        book: {}
    });
});

router.post('/create', (req, res) => {
    const { title, author, description } = req.body;
    db.prepare('INSERT INTO book (title, author, description) VALUES (?, ?, ?)')
        .run(title, author, description);
    res.redirect('/book');
});

router.get('/:id', (req, res) => {
    const book = db.prepare('SELECT * FROM book WHERE id = ?').get(req.params.id);

    if (!book) {
        return res.status(404).render('error', { message: 'Book not found', error: {} });
    }

    res.render('book/show', { title: book.title, bodyClass: 'show', book });
});

router.get('/:id/edit', (req, res) => {
    const book = db.prepare('SELECT * FROM book WHERE id = ?').get(req.params.id);

    if (!book) {
        return res.status(404).render('error', { message: 'Book not found', error: {} });
    }

    res.render('book/edit', { title: `Edit Book ${book.title}`, bodyClass: 'edit', book });
});

router.post('/:id/edit', (req, res) => {
    const { title, author, description } = req.body;
    db.prepare('UPDATE book SET title = ?, author = ?, description = ? WHERE id = ?')
        .run(title, author, description, req.params.id);
    res.redirect('/book');
});

router.post('/:id/delete', (req, res) => {
    db.prepare('DELETE FROM book WHERE id = ?').run(req.params.id);
    res.redirect('/book');
});

module.exports = router;

//czat pomagal