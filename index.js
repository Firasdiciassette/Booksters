"use strict";
// Required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const initializePassport = require('./public/javascripts/passport-config');
const sqlite3 = require('sqlite3').verbose();
const SQLiteStore = require('connect-sqlite3')(session);
const UserDAO = require('./dao/user-dao');
const SessionDAO = require('./dao/session-dao');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

//Body and cookie parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection to local file
const db = new sqlite3.Database('./booksters.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log("Error occurred - " + err.message + err.name);
  } else {
    console.log("Database Connected!");
  }
});

// Session mgmt
const userDAO = new UserDAO(db);
const sessionDAO = new SessionDAO(db);

app.use(session({
    store: new SQLiteStore({
        db: './booksters.db',
        table: 'sessions',
    }),
    name: 'usersession',
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60000 * 60, // 1 hour
      secure: false
     }
}));

app.use((req, res, next) => {
  if(req.session){
    sessionDAO.saveSession(req.sessionID, req.session, Date.now() + 86400000, (err) => {
      if(err) console.error('Error saving session', err);
    });
  }
  next();
})



// Passport
initializePassport(passport, userDAO);
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// Routes and dynamic rendering
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }),  
);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await userDAO.findUserByEmail(username);
    if(!user) {
      return res.status(401).send('Invalid username or password');
    }
    const match = await bcrypt.compare(password, user.passport);
    if(!match){
      return res.status(401).send('Invalid username or password');
    }

    req.session.userID = user.id;
    req.session.username = user.username;
    console.log('Login successful');
    res.send('Login successful');
  } catch (error) {
    console.error('Login error: ', error);
    res.status(500).send('An error occurred. Please try agaim');
  }
});

app.get('/register', (req, res) => {
  res.render('register');
});


app.post('/register', async (req, res) => {
  try {
    const { username, email, password, 'confirm-password': confirmPassword } = req.body;
    console.log('Request body:', req.body);

    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match.');
      return res.redirect('/register');
    }

    const existingUserByUsername = await userDAO.findUserByUsername(username);
    if (existingUserByUsername) {
      console.log('Existing user by username found:', existingUserByUsername);

      if (username === existingUserByUsername.username) {
        req.flash('error_msg', 'Username taken.');
        return res.redirect('/register');
      }
    }
    const existingUserByEmail = await userDAO.findUserByEmail(email);
    if (existingUserByEmail) {
      console.log('Existing user by email found:', existingUserByEmail);

      if (email === existingUserByEmail.email) {
        req.flash('error_msg', 'Email already in use.');
        return res.redirect('/register');
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await userDAO.createUser(username, email, hashedPassword);
    req.flash('success_msg', 'You are now registered and can log in.');
    res.render('registration-success', { delay: 3000 });
    res.redirect('/login');

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack trace:', error.stack);
    req.flash('error_msg', 'An error occurred. Please try again.');
    res.redirect('/register');
  }
});


app.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          console.error(err);
          return res.redirect('/');
      }
      req.flash('success_msg', 'You have logged out.');
      res.redirect('/');
  });
});


// Server boot
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Server shutting down
process.on('SIGINT', () => {
  db.close((err) => {
      if (err) {
          console.error('Error closing the database:', err.message);
      }
      console.log('Database closed.');
      process.exit(0);
  });
});