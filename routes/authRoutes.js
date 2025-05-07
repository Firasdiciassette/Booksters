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
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error_msg', 'Invalid credentials');
      return res.redirect('/login');
    }
    req.logIn(user, err => {
      if (err) return next(err);
      // store extra user data in session
      req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
      };
      return res.redirect('/');
    });
  })(req, res, next);
});


router.get('/register', authController.getRegister);
router.post('/register', authController.postRegister);
  

router.get('/logout', authController.logout);

module.exports = router;