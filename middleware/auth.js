// Custom middleware to ensure a user is logged before using website features
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view this resource.');
    res.redirect('/login');
  }
  
  module.exports = { ensureAuthenticated };
  