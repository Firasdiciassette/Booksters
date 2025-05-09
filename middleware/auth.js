// /middleware/auth.js
// Custom middleware to ensure a user is logged before using website features
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource.');
    res.redirect('/login');
  }
  

// Custon middleware to ensure the currently logged in user is an admin
  function isAdmin(req, res, next) {
    if(req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    res.status(403).send('Forbidden.');
  }

  module.exports = { isAuthenticated, isAdmin };