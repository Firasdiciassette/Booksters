// /routes/mainRoutes.js
// General/Public Site Routes*
// Manages routes unrelated to authentication.
// Typically includes homepage, dashboard, or public info pages.
// Should **not** include any login/register/logout logic.
const express = require('express');
const router = express.Router();
const BookDAO = require('../dao/book-dao');
const db = require('../config/db');
const { ensureAuthenticated } = require('../middleware/auth');

const bookDAO = new BookDAO(db);

// My profile route
router.get('/profile', ensureAuthenticated, async (req, res) =>{
    const userId = req.user.id;
    const bookDAO = req.app.locals.bookDAO;
    try {
        const books = await bookDAO.getBooksByUser(userId);
        res.render('profile', { books: books, user: req.user });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Loading books failed');
        res.render('profile', { books: [] });
    }
});

// Home page
// Home page
router.get('/', async (req, res) => {
    try {
        const botM = await bookDAO.getBooksOfTheMonth();
        const books = await bookDAO.getAllBooks();

        res.render('index', {
            books,
            botM,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.error('Error loading books:', err);
        req.flash('error_msg', 'Failed to load books.');
        res.redirect('/');
    }
});


/* Add A Book page (rendering a form for book addition)*/
router.get('/add-book', (req, res) => {
    res.render('add-book', {
        success_msg: req.flash('success_msg'),
        error_msg: req.flash('error_msg')
    });
});

// Handle the POST request for adding a new book
router.post('/books/add', async (req, res) => {
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

// View a specific book
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
