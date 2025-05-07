// app.js
"use strict";
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const initializePassport = require('./config/passport');
const bodyParser = require('body-parser');
const db = require('./config/db');
const UserDAO = require('./dao/user-dao');
const SessionDAO = require('./dao/session-dao');
const BookDAO = require('./dao/book-dao');
const authRoutes = require('./routes/authRoutes');
const mainRoutes = require('./routes/mainRoutes');
const bookSearchApi = require('./routes/api/bookSearch');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', bookSearchApi);

const userDAO = new UserDAO(db);
const bookDAO = new BookDAO(db);
const sessionDAO = new SessionDAO(db);
app.locals.userDAO = userDAO;
app.locals.bookDAO = bookDAO;

/*app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/register', (req, res) => {
  console.log('Global handler hit directly');
  res.send('ping');
});*/


app.use(session({
  store: new (require('connect-sqlite3')(session))({ db: './booksters.db' }),
  name: 'usersession',
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // Cookies will last for one hour
}));

app.use((req, res, next) => {
  if (req.session) {
    sessionDAO.saveSession(req.sessionID, req.session, Date.now() + 86400000, err => {
      if (err) console.error('Error saving session', err);
    });
  }
  next();
});

initializePassport(passport, userDAO);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// This makes sure the flash messages and the user req body are passed globally to all views.
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  console.log(req.user);
  next();
});

// Database shut down
process.on('SIGINT', () => {
  db.close((err) => {
      if (err) {
          console.error('Error closing the database:', err.message);
      }
      console.log('Database closed.');
      process.exit(0);
  });
});

app.use('/', authRoutes);
app.use('/', mainRoutes);

module.exports = app;
