import sqlite3

conn = sqlite3.connect('booksters.db')
cursor = conn.cursor()

# CRUD operations
# cursor.execute('''
#     CREATE TABLE users (
#     id INTEGER PRIMARY KEY,
#     username TEXT NOT NULL,
#     password TEXT NOT NULL
#     )
# ''')

### Parametrized queries (using '?') placeholders prevent SQL injection (cool)
# cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", ('admin', 'primepass'))
# conn.commit()

# cursor.execute("DELETE FROM users WHERE id = ?", ('1'))
# conn.commit()

cursor.execute("SELECT * FROM users")
print(cursor.fetchall())

conn.close()