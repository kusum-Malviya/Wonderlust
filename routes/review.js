const express = require('express');
const router = express.Router({mergeParams : true});
const wrapAsync = require('../utils/wrapAsync.js')           // Appending Wrap Async Function
const {valtidateReview, isLoggedIn,isReviewAuthor} = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');


// Post Route for reviews
router.post("/",isLoggedIn,valtidateReview,wrapAsync(reviewController.createNewReview))

// Destroy Route for reviews
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;