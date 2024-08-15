const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const db = require("../db/queries");

exports.signUp_get = asyncHandler(async (req, res, next) => {
  res.render("signUpForm", {
    title: "Sign Up",
  });
});

exports.signUp_post = [
  body("firstName", "First name should not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "Username should not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("password", "password should not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("confirm-password", "Confirmation password should not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    bcrypt.hash(req.body.password, 10, async (err, hassedPassword) => {
      if (err) {
        return next(err);
      }

      const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hassedPassword,
      };

      if (!errors.isEmpty()) {
        res.render("signUpForm", {
          title: "Error while signing up",
        });
      } else {
        try {
          await db.insertUser(user);
          res.redirect("/login");
        } catch (err) {
          return next(err);
        }
      }
    });
  }),
];
