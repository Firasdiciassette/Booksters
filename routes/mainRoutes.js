// /routes/mainRoutes.js
// General/Public Site Routes*
// Manages routes unrelated to authentication.
// Typically includes homepage, dashboard, or public info pages.
// Should **not** include any login/register/logout logic.
const express = require('express');
const router = express.Router();
const BookDAO = require('../dao/book-dao');
const ReviewDAO = require('../dao/review-dao');
const db = require('../config/db');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const bookDAO = new BookDAO(db);
const reviewDAO = new ReviewDAO(db);

// Home page
router.get('/', async (req, res) => {
    try {
        const botM = await bookDAO.getBooksOfTheMonth();
        const books = await bookDAO.getAllBooks();
        const reviews = await reviewDAO.getRecentReviews(5);
        res.render('index', {
            books,
            botM,
            reviews,
            user: req.session.user
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
        res.render('profile', { 
            books: books,
             user: req.user });
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Loading books failed');
        res.render('profile', { books: [] });
    }
}); 

/* Book details page route */
router.get('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    //console.log('Requested book ID:', bookId);

    try {
        const book = await bookDAO.getBookById(bookId);
        const reviews = await reviewDAO.getReviewsByBookId(bookId);
        if (!book) {
            req.flash('error_msg', 'Book not found');
            return res.redirect('/');
        }
        res.render('book', {
            book,
            reviews,
            user: req.session.user,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (err) {
        console.error('Error retrieving book or reviews:', err);
        req.flash('error_msg', 'Something went wrong');
        res.redirect('/');
    }
});

router.post('/books/delete', isAuthenticated, async (req, res) => {
    const bookId = req.body.bookId;
    const userId = req.session.user.id;

    try {
        await bookDAO.deleteBookFromUserLibrary(userId, bookId);
        await bookDAO.deleteBook(bookId);
        req.flash('success_msg', 'Book removed from your library.');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Failed to remove book.');
        res.redirect('/profile');
    }
});

// Post req for 'generic' book addition
router.post('/books/add', isAuthenticated, async (req, res) => {
    const { title, author, genre, description, cover_url } = req.body;
    const addedBy = req.user.id;
    const date = new Date().toISOString();

    try {
        const result = await bookDAO.addBook(title, author, genre, description, cover_url, addedBy);
        const bookId = result.id;
        await bookDAO.insertBookByUser(addedBy, bookId);   
        req.flash('success_msg', 'Book added successfully!');
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error while adding book.');
        res.redirect('/profile');
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


// admin botm adding
router.post('/booksOfTheMonth/add', isAdmin, async (req, res) => {
    const { title, author, genre, description, cover_url } = req.body;

    try {
        const { id: bookId } = await bookDAO.addBook(title, author, genre, description, cover_url);
        try {
            await bookDAO.addBookByAdmin(bookId);
            req.flash('success_msg', 'Book of the Month added successfully!');
        } catch (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                req.flash('error_msg', 'Book of The Month already exists.');
            } else {
                throw err; 
            }
        }
        res.redirect('/profile');
    } catch (err) {
        console.error('Unexpected error:', err);
        req.flash('error_msg', 'Error while adding new Book of the Month');
        res.redirect('/profile');
    }
});


// BotM deletion route
router.post('/booksOfTheMonth/delete', isAdmin, async (req, res) => {
    const bookId = parseInt(req.body.bookId);
    console.log("Book to be erased: ", bookId);
    try {
        
        await bookDAO.deleteBookAdmin(bookId);
        req.flash('success_msg', 'Book of the Month removed successfully.');
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting book:', err);
        req.flash('error_msg', 'Error occurred while deleting book.');
        res.redirect('/');
    }
});

// Review books
router.post('/books/review', isAuthenticated, async( req, res) => {
    const { content, rating, book_id } = req.body;
    const userId = req.user.id;

    try {
        await reviewDAO.addReview(userId, book_id, content, rating);
        req.flash('success_msg', 'Review added!');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error while adding review.');
    }
    res.redirect(`/books/${book_id}`);
});


module.exports = router;
