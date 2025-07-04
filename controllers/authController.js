// /controllers/authController.js
const bcrypt = require('bcrypt');

// Visualizza (renderizza) la pagina login, chiamata quando l'utente naviga a /login
exports.getLogin = (req, res) => {
  res.render('login'); 
};
// Visualizza la pagina di registrazione, chiamata quando l'utente naviga a /register
exports.getRegister = (req, res) => {
  res.render('register');
};
// Gestisce il form di registrazione inviato dall'utente
exports.postRegister = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const userDAO = req.app.locals.userDAO;

  // Verifica che il DAO per gli utenti sia disponibile
  if (!userDAO) {
    return res.status(500).send('Errore di configurazione del server');
  }

  try {
    // Controlla che le password inserite corrispondano
    if (password !== confirmPassword) {
      req.flash('error_msg', 'Le password non corrispondono.');
      return res.redirect('/register');
    }

  // Controlla se username ed email è già usato
  const existingUser = await userDAO.findUserByUsername(username);
  if (existingUser) {
    req.flash('error_msg', 'Username già in uso.');
    return res.redirect('/register');
  }

  const existingEmail = await userDAO.findUserByEmail(email);
  if (existingEmail) {
    req.flash('error_msg', 'Email già utilizzata.');
    return res.redirect('/register');
  }

  // Cifratura password con bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Il primo loggato è l'admin
  const userCount = await userDAO.getUserCount();
  const role = userCount === 0 ? 'admin' : 'user';

  // Crea l'utente nel database
  await userDAO.createUser(username, email, hashedPassword, role);

  req.flash('success_msg', 'Registrazione avvenuta con successo.');
  return res.redirect('/login');

} catch (err) {
  console.error('Errore durante la registrazione:', err);
  req.flash('error_msg', 'Si è verificato un errore durante la registrazione.');
  return res.redirect('/register');
}
};
// Si occupa del logout
exports.logout = (req, res) => {
  req.logout(err => {
    if (err) return console.error(err);
    req.flash('success_msg', 'Logged out successfully.');
    res.redirect('/');
  });
};
