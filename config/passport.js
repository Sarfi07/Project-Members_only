const passport = require("passport");
const LocalStartegry = require("passport-local").Strategy;
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const db = require("../db/queries");

passport.use(
  new LocalStartegry(async (username, password, done) => {
    try {
      // const user = await User.findOne({ username: username });
      const user = await db.findUser(username);

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect Password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    // const user = await User.findById(id);
    const user = await db.findUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
