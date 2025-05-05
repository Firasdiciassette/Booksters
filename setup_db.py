import sqlite3

conn = sqlite3.connect('booksters.db')
cursor = conn.cursor()

# cursor.execute("DROP TABLE users")
# cursor.execute("DELETE FROM sessions")
# cursor.execute("DELETE FROM users")
cursor.execute("DELETE FROM books")
# cursor.execute("DROP TABLE sessions")

## CRUD operations ###
# cursor.execute('''
#     CREATE TABLE IF NOT EXISTS users (
#     id INTEGER PRIMARY KEY,
#     username TEXT NOT NULL,
#     email TEXT NOT NULL,
#     password TEXT NOT NULL,
#     role TEXT NOT NULL
#     )
# ''')

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


# cursor.execute("SELECT * FROM users")
# cursor.execute("SELECT * FROM sessions")
# cursor.execute("SELECT * FROM books")
cursor.execute("SELECT * FROM booksOfTheMonth")
# cursor.execute("SELECT * FROM books where added_by = 1 ORDER BY created_at DESC")
print(cursor.fetchall())

conn.commit()

conn.close()