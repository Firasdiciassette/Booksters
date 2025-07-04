// /middleware/auth.js
/**
 * Middleware custom per verificare se l'utente è autenticato.
 * Se l'utente è autenticato, prosegue; altrimenti lo reindirizza alla login.
 *
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 * @param {Function} next - Funzione per passare al middleware successivo
 */
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view this resource.');
  res.redirect('/login');
}

/**
 * Middleware custom per verificare se l'utente ha ruolo admin.
 * Se l'utente è admin ok altrimenti restituisce errore 403.
 *
 * @param {Object} req - Oggetto richiesta Express
 * @param {Object} res - Oggetto risposta Express
 * @param {Function} next - Funzione per passare al middleware successivo
 */
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.status(403).send('Forbidden.');
}

module.exports = { isAuthenticated, isAdmin };
