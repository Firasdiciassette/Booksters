const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, userDAO) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      userDAO.findUserByUsername(username).then(user => {
        if (!user) {
          return done(null, false, { message: 'Invalid username' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) return done(err);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid password' });
          }
        });
      }).catch(err => done(err));
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    userDAO.findUserById(id).then(user => {
      done(null, user);
    }).catch(err => done(err));
  });
}

module.exports = initialize;
