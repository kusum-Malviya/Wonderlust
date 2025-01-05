const express = require('express');
const router = express.Router();
const User = require('../models/user.js');                      // Requiring User Model
const wrapAsync = require('../utils/wrapAsync');                // Appending Wrap Async Function
const passport = require('passport');                           // Requiring passport package 
const { saveRedirectUrl } = require("../middleware.js");
const userController = require('../controllers/users.js');

// Signup route
router.route("/signup")
    .get((req, res) => {
        res.render("users/signup", {
            isListingPage: false,  // Explicitly passing isListingPage flag as false for signup page
            title: "Sign Up"
        });
    })
    .post(wrapAsync(userController.signup));

// Login route
router.route('/login')
    .get(saveRedirectUrl, (req, res) => {
        res.render("users/login", {
            isListingPage: false,  // Explicitly passing isListingPage flag as false for login page
            title: "Log In"
        });
    })
    .post(
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        wrapAsync(userController.login)
    );

// Logout route
router.get("/logout", userController.logout);

// Example of user dashboard route (if needed)
router.get("/dashboard", wrapAsync(async (req, res) => {
    try {
        // Assuming you have some logic here to get the user's data (if any)
        const user = await User.findById(req.user._id);

        // Example of setting isListingPage flag for a dashboard page or profile page
        res.render("userDashboard", {
            isListingPage: false,   // Explicitly passing isListingPage flag as false
            user: user,
            title: "User Dashboard"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching user data.");
    }
}));

module.exports = router;
