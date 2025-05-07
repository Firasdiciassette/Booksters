// /routes/mainRoutes.js
// General/Public Site Routes*
// Manages routes unrelated to authentication.
// Typically includes homepage, dashboard, or public info pages.
// Should **not** include any login/register/logout logic.
const express = require('express');
const router = express.Router();
const BookDAO = require('../dao/book-dao');
const db = require('../config/db');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const bookDAO = new BookDAO(db);

// Home page
router.get('/', async (req, res) => {
    try {
        const botM = await bookDAO.getBooksOfTheMonth();
        const books = await bookDAO.getAllBooks();
        res.render('index', {
            books,
            botM,
            user: req.session.user
            // useless because you already defined them globally in app.js
            //success_msg: req.flash('success_msg'), 
            //error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.log('Flash error: ', req.flash('error_msg'));
        console.error('Error loading books:', err);
        req.flash('error_msg', 'Failed to load books.');
        res.redirect('/');
    }
});

// My profile route
router.get('/profile', isAuthenticated, async (req, res) =>{
    const userId = req.user.id;
    const bookDAO = req.app.locals.bookDAO;
    try {
        const books = await bookDAO.getBooksByUser(userId);
        //console.log('Books for user:', books);
        res.render('profile', { books: books, user: req.user });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Loading books failed');
        res.render('profile', { books: [] });
    }
}); 

// botm book adding
router.post('/library/add', isAuthenticated, async (req, res) => {
    let { bookId } = req.body;
    const userId = req.user.id;
    try {
        const botmBook = await bookDAO.getBookOfTheMonthById(bookId);
        if (!botmBook) {
            req.flash('error_msg', 'Book not found.');
            return res.redirect('/');
        }
        let existingBook = await bookDAO.getBookByTitleAndAuthor(botmBook.title, botmBook.author);
        let newBookId;
        if (existingBook) {
            newBookId = existingBook.id;
        } else {
            const inserted = await bookDAO.addBook(
                botmBook.title,
                botmBook.author,
                botmBook.genre,
                botmBook.description,
                botmBook.cover_url,
                null
            );
            newBookId = inserted.id;
        }
        const alreadyAdded = await bookDAO.getBookAddedByUser(newBookId, userId);
        if (alreadyAdded) {
            req.flash('error_msg', 'This book is already in your library.');
            return res.redirect('/');
        }
        await bookDAO.insertBookByUser(userId, newBookId);
        req.flash('success_msg', 'Book added into your library!');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to add book into your library.');
        res.redirect('/');
    }
});
 

// Post req for 'generic' book addition
router.post('/books/add', isAuthenticated, async (req, res) => {
    const { title, author, genre, description } = req.body;
    const addedBy = req.user.id;
    const date = new Date().toISOString();

    try {
        await bookDAO.addBook(title, author, genre, description, null, addedBy);
        req.flash('success_msg', 'Book added successfully!');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error while adding book.');
        res.redirect('/profile');
    }
});

// admin botm adding
router.post('/booksOfTheMonth/add', isAdmin, async (req, res) => {
    const { title, author, genre, description, cover_url} = req.body;
    try {
        await bookDAO.addBookByAdmin(title, author, genre, description, cover_url);
        req.flash('success_msg', 'Book of the month added successfully!');
        res.redirect('/profile');
    }catch(err){
        console.error(err);
        req.flash('error_msg', 'Error while adding new book of the monht');
        res.redirect('/profile');
    }
});

// BotM deletion route
router.post('/books/delete', isAdmin, async (req, res) => {
    const bookId = req.body.bookId;
    //console.log('current user in session: ', req.session.user);

    try {
        await bookDAO.deleteBookAdmin(bookId);
        req.flash('success_msg', 'Book of the Month removed successfully.');
        const botM = await bookDAO.getBooksOfTheMonth();
        const books = await bookDAO.getAllBooks();
        res.render('index', {
            books,
            botM,
            user: req.session.user, 
            success_msg: req.flash('success_msg')
        });
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).send('Error occurred while deleting book');
    }
});


// View a specific book (TO BE FIXED...)
router.get('/book/:id', (req, res) => {
    const bookId = req.params.id;

    bookDAO.getBookById(bookId)
        .then(book => {
            if (!book) {
                req.flash('error_msg', 'Nothing here...');
                return res.redirect('/');
            }
            res.render('book-details', { book });
        })
        .catch(err => {
            console.error('Error fetching book:', err);
            req.flash('error_msg', 'Failed to load book details.');
            res.redirect('/');
        });
});

module.exports = router;
