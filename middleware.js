const Listing = require('./models/listing');
const Review = require('./models/review.js');
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema.js"); // Require Schema.js file to apply Joi for server-side validations

// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a listing!");
        return res.redirect("/login");
    }
    next();
};

// Middleware to save the redirect URL for later use
module.exports.saveRedirectUrl = (req, res, next) => {
    if (!req.isAuthenticated() && req.originalUrl) {
        req.session.returnTo = req.originalUrl; // Save the intended URL
    }
    next();
};

// Middleware to set the current user globally in res.locals
module.exports.setCurrentUser = (req, res, next) => {
    res.locals.currUser = req.user || null; // Set currUser to the authenticated user or null
    next();
};

// Middleware to check if the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Middleware to validate a listing against Joi schema
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Middleware to validate a review against Joi schema
module.exports.valtidateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Middleware to check if the logged-in user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
};
