var express = require("express");
var router = express.Router();
const signUpController = require("../controllers/signUpController");
const authController = require("../controllers/authController");
const isAuthenticated = require("../utils/checkAuthentication");
/* GET home page. */
router.get("/", isAuthenticated, function (req, res, next) {
  res.redirect("/dashboard");
});

router.get("/sign-up", signUpController.signUp_get);
router.post("/sign-up", signUpController.signUp_post);

router.get("/login", authController.login_get);
router.post("/login", authController.authenticate);

router.get("/logout", authController.logout);

module.exports = router;
