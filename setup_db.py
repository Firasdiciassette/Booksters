import sqlite3

conn = sqlite3.connect('booksters.db')
cursor = conn.cursor()

### CRUD operations ###
# cursor.execute('''
#     CREATE TABLE users (
#     id INTEGER PRIMARY KEY,
#     username TEXT NOT NULL,
#     email TEXT NOT NULL,
#     password TEXT NOT NULL
#     )
# ''')

### Parametrized queries (using '?') placeholders prevent SQL injection (cool) ###
# cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", ('admin', 'primepass'))
# cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", ('test', 'testpass'))
# conn.commit()

# cursor.execute("DROP TABLE sessions")


cursor.execute("SELECT * FROM users")
# cursor.execute("SELECT * FROM sessions")
print(cursor.fetchall())

conn.commit()

conn.close()