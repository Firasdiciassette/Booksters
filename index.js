"use strict";
// Required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

// Serve all static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const db = new sqlite3.Database('booksters.db');

// Middleware
/* Passport (not using this yet)
passport.use(new LocalStrategy(
  function(username, password, done) {
    if (username === 'admin' && password === 'password') {
      return done(null, { id: 1, username: 'admin' });
    } else {
      return done(null, false, { message: 'Invalid credentials' });
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, { id: 1, username: 'admin' });
});
*/

// Routes definition, dynamic rendering

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', 
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);


// Server activation
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
