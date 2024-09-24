"use strict";
// Required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const initializePassport = require('./public/javascripts/passport-config');
const sqlite3 = require('sqlite3').verbose();
const UserDAO = require('./dao/user-dao');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Serve all static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection to local file
const db = new sqlite3.Database('./booksters.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log("Error occurred - " + err.message + err.name);
  } else {
    console.log("Database Connected!");
  }
});

const userDAO = new UserDAO(db);

// Middleware
app.use(session({
  secret: 'revolution',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Initialize Passport
initializePassport(passport, userDAO);

app.use(passport.initialize());
app.use(passport.session());

// Routes definition and dynamic rendering
app.get('/', (req, res) => {
  res.render('index.ejs'); // Check if the extension is actually needed
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })
);

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match.');
      //return res.redirect('/register'); no need for redirection
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    userDAO.createUser({ username, email, password: hashedPassword })
      .then(() => {
        req.flash('success_msg', 'You are now registered and can log in.');
        res.redirect('/login');
      })
      .catch((err) => {
        console.error('Error registering user:', err.message);
        req.flash('error_msg', '\nRegistration failed. Please try again.');
        res.redirect('/register');
      });
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('error_msg', 'An error occurred. Please try again.');
    res.redirect('/register');
  }
});



// Server booting
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
