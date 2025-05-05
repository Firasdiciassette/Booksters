// /controllers/authController.js
const bcrypt = require('bcrypt');

exports.getLogin = (req, res) => {
  res.render('login'); 
};

exports.getRegister = (req, res) => {
  res.render('register');
};

exports.postRegister = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  const userDAO = req.app.locals.userDAO;

  if (!userDAO) {
    return res.status(500).send('Server config error');
  }

  console.log("Received registration data:", req.body);

  try {
    if (password !== confirmPassword) {
      req.flash('error_msg', 'Passwords do not match.');
      return res.redirect('/register');
    }

    const existingUser = await userDAO.findUserByUsername(username);
    if (existingUser) {
      req.flash('error_msg', 'Username already taken.');
      return res.redirect('/register');
    }

    const existingEmail = await userDAO.findUserByEmail(email);
    if (existingEmail) {
      req.flash('error_msg', 'Email already in use.');
      return res.redirect('/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userCount = await userDAO.getUserCount();
    const role = userCount === 0 ? 'admin' : 'user';

    await userDAO.createUser(username, email, hashedPassword, role);

    req.flash('success_msg', 'You are now registered.');
    return res.redirect('/login');
  } catch (err) {
    console.error('Registration error:', err);
    req.flash('error_msg', 'An error occurred during registration.');
    return res.redirect('/register');
  }
};

exports.logout = (req, res) => {
  req.logout(err => {
    if (err) return console.error(err);
    req.flash('success_msg', 'Logged out successfully.');
    res.redirect('/');
  });
};
