import sqlite3

conn = sqlite3.connect('booksters.db')
cursor = conn.cursor()

cursor.execute("""
    CREATE TABLE IF NOT EXISTS booksOfTheMonth (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        book_id INTEGER NOT NULL,
        FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
        UNIQUE(id)
    );
""")

# default books
# default_books = [
#     {
#         "title": "Manufacturing Consent: The Political Economy of the Mass Media",
#         "author": "Noam Chomsky",
#         "genre": "Politics",
#         "description": """Manufacturing Consent: The Political Economy of the Mass Media is a 1988 book by Edward S. Herman and Noam Chomsky.
#         It argues that the mass communication media of the U.S. are effective and powerful ideological institutions that carry out a
#         system-supportive propaganda function...""",
#         "cover_url": "https://upload.wikimedia.org/wikipedia/en/c/ce/Manugactorinconsent2.jpg"
#     },
#     {
#         "title": "Inventare i libri. L'avventura di Filippo e Lucantonio Giunti, pionieri dell'editoria moderna",
#         "author": "Alessandro Barbero",
#         "genre": "History",
#         "description": """Nel 1485, ser Bernardo Machiavelli annota nel suo libro di ricordi di aver comprato «da Filippo di Giunta,
#         librario del popolo di Santa Lucia d’Ognisanti» due volumi, uno di diritto e uno di storia...""",
#         "cover_url": "https://www.ibs.it/images/9788809861916_0_0_536_0_75.jpg"
#     },
#     {
#         "title": "The Ottomans: A Cultural Legacy",
#         "author": "Diana Darke",
#         "genre": "History",
#         "description": """A richly illustrated examination of the Ottoman Empire, 100 years since its dissolution,
#         unraveling its complex cultural legacy and profound impact on Europe, North Africa, and the Middle East.""",
#         "cover_url": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1653105164i/60670064.jpg"
#     }
# ]
#
# for book in default_books:
#     cursor.execute("""
#         INSERT INTO books (title, author, genre, description, cover_url)
#         VALUES (?, ?, ?, ?, ?)""",
#         (book["title"], book["author"], book["genre"], book["description"], book["cover_url"])
#     )
#     book_id = cursor.lastrowid
#
#     # Insert into booksOfTheMonth table using the ID
#     cursor.execute("""
#         INSERT INTO booksOfTheMonth (book_id)
#         VALUES (?)""", (book_id,)
#     )
conn.commit()
conn.close()
