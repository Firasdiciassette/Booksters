// Questo file gestisce tutte le rotte legate all'autenticazione
// Include: login, registrazione e logout

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController.js'); // Controller con la logica delle view e registrazione

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Show login form
 *     responses:
 *       200:
 *         description: Rendered login page
 */
router.get('/login', authController.getLogin);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user, use passport
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to profile on success or login on failure
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      // Se l'utente non esiste o credenziali errate
      req.flash('error_msg', 'Credenziali non valide');
      return res.redirect('/login');
    }

    // Autenticazione ok, logga l'utente
    req.logIn(user, err => {
      if (err) return next(err);

      // Salva info base dell'utente nella sessione
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };
      // Tutto ok
      req.flash('success_msg', 'Accesso effettuato con successo!');
      return res.redirect('/profile');
    });
  })(req, res, next);
});

/**
 * @swagger
 * /register:
 *   get:
 *     summary: Show registration form
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Rendered registration page
 */
router.get('/register', authController.getRegister);

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirect to login page on success
 */
router.post('/register', authController.postRegister);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out the user
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to home after logout
 */
router.get('/logout', authController.logout);

// Esporta il router per essere usato nell'app principale
module.exports = router;
