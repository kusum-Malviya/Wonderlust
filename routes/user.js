const express = require('express');
const router = express.Router();
const User = require('../models/user.js');                      // Requiring User Model
const wrapAsync = require('../utils/wrapAsync');                // Appending Wrap Async Function
const passport = require('passport');                           // Requiring passport package 
const {saveRedirectUrl} = require("../middleware.js");
const userController = require('../controllers/users.js');

router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate(
            "local",
            { failureRedirect : "/login", failureFlash : true }
            )
        ,wrapAsync(userController.login)
    );

router.get("/logout",userController.logout)

module.exports = router ;