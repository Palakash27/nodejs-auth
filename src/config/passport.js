const LocalStrategy = require("passport-local").Strategy;
const bycrypt = require("bcryptjs");

// Load user model
const User = require("../models/User");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        // Match User
        const user = await User.findOne({ email }).catch(err =>
          console.log(err),
        );
        if (!user) {
          return done(null, false, {
            message: "That email is not registered",
          });
        }
        // Match Password
        bycrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { message: "Password is incorrect" });
        });
      },
    ),
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
