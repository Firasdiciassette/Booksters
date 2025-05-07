import sqlite3

conn = sqlite3.connect('booksters.db')
cursor = conn.cursor()

## CRUD operations ###
# users table
# cursor.execute('''
#     CREATE TABLE IF NOT EXISTS users (
#     id INTEGER PRIMARY KEY,
#     username TEXT NOT NULL,
#     email TEXT NOT NULL,
#     password TEXT NOT NULL,
#     role TEXT NOT NULL
#     )
# ''')

# the books table
# cursor.execute('''
#     CREATE TABLE IF NOT EXISTS books (
#         id INTEGER PRIMARY KEY AUTOINCREMENT,
#         title TEXT NOT NULL,
#         author TEXT NOT NULL,
#         genre TEXT,
#         description TEXT,
#         cover_url TEXT,
#         added_by INTEGER,
#         created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
#         FOREIGN KEY (added_by) REFERENCES users(id))
#         ''')

# join table between users and books
# cursor.execute('''
#     CREATE TABLE IF NOT EXISTS user_books (
    #     user_id INTEGER,
    #     book_id INTEGER,
    #     added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    #     PRIMARY KEY (user_id, book_id),
    #     FOREIGN KEY (user_id) REFERENCES users (id),
    #     FOREIGN KEY (book_id) REFERENCES books(id) )
#     ''')
# cursor.execute("DROP TABLE sessions")
# cursor.execute("DROP TABLE users")
# cursor.execute("DELETE FROM sessions")
# cursor.execute("DELETE FROM users")
# cursor.execute("DELETE FROM books")
# cursor.execute("DELETE FROM user_books")


# cursor.execute("SELECT * FROM users")
# cursor.execute("SELECT * FROM sessions")
cursor.execute("SELECT * FROM booksOfTheMonth")
# cursor.execute("SELECT * FROM books")
# cursor.execute("SELECT * FROM user_books")
# cursor.execute('''
#     SELECT books.*
#     FROM books
#     INNER JOIN user_books on books.id = user_books.book_id
#     WHERE user_books.user_id = ?
#     ''', 1)

# print('Books for user:', books)

print(cursor.fetchall())
conn.commit()
conn.close()