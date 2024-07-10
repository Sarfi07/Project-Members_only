const passport = require("passport");
const asyncHandler = require("express-async-handler");

exports.authenticate = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/",
});

exports.login_get = asyncHandler(async (req, res, next) => {
  res.render("loginForm");
});

exports.logout = asyncHandler(async (req, res, next) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
  });

  res.redirect("/login");
});
