// /routes/authRoutes.js
/* 
 *Routing Layer for Authentication*

- Defines the **HTTP routes** related to authentication.
- Delegates logic to `authController`.
- No logic here — only calls to controller methods. 
*/

const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController.js');

//console.log('authRoutes loaded'); 

router.get('/login', authController.getLogin);
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
  

router.get('/logout', authController.logout);

module.exports = router;