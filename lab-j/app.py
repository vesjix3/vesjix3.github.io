from flask import Flask, render_template, request, redirect, url_for
import sqlite3

app = Flask(__name__)

def get_db_connection():
    conn = sqlite3.connect('data.db')
    conn.row_factory = sqlite3.Row
    return conn



@app.route('/books')
def book_index():
    conn = get_db_connection()
    books = conn.execute('SELECT * FROM book').fetchall()
    conn.close()
    return render_template('book/index.html', title='Lista Książek', books=books)


@app.route('/books/<int:id>')
def book_show(id):
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (id,)).fetchone()
    conn.close()
    if book is None:
        return "Nie znaleziono takiej książki", 404
    return render_template('book/show.html', title=book['title'], book=book)



@app.route('/books/create', methods=['GET', 'POST'])
def book_create():
    if request.method == 'POST':
        title = request.form['title']
        author = request.form['author']

        conn = get_db_connection()
        conn.execute('INSERT INTO book (title, author) VALUES (?, ?)', (title, author))
        conn.commit()
        conn.close()
        return redirect(url_for('book_index'))

    return render_template('book/create.html', title='Dodaj nową książkę')


@app.route('/books/<int:id>/edit', methods=['GET', 'POST'])
def book_edit(id):
    conn = get_db_connection()
    book = conn.execute('SELECT * FROM book WHERE id = ?', (id,)).fetchone()

    if request.method == 'POST':
        title = request.form['title']
        author = request.form['author']

        conn.execute('UPDATE book SET title = ?, author = ? WHERE id = ?', (title, author, id))
        conn.commit()
        conn.close()
        return redirect(url_for('book_index'))

    conn.close()
    if book is None:
        return "Nie znaleziono takiej książki", 404
    return render_template('book/edit.html', title='Edytuj książkę', book=book)



@app.route('/books/<int:id>/delete', methods=['POST', 'GET'])
def book_delete(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM book WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('book_index'))




if __name__ == '__main__':
    app.run(debug=True, port=57893)