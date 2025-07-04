  const LocalStrategy = require('passport-local').Strategy;
  const bcrypt = require('bcrypt');

  const invalidCredentialsError = "Invalid credentials";

  function initialize(passport, userDAO) {
    passport.use(new LocalStrategy(
      function(username, password, done) {
        userDAO.findUserByUsername(username).then(user => {
          if (!user) {
            return done(null, false, { message: invalidCredentialsError });
          }
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) return done(err);
            if (result) {
              return done(null, user);
            } else {
              return done(null, false, { message: invalidCredentialsError });
            }
          });
        }).catch(err => done(err));
      }
    ));
    
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async(id, done) => { 
    try {
      const user = await userDAO.findUserById(id); 
      done(null, user);
    } catch {
      done(err);
    }   
  });   
}
  module.exports = initialize;
