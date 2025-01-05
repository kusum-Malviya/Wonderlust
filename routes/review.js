const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js'); // Appending Wrap Async Function
const { valtidateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');

// Post Route for creating a new review
router.post("/", isLoggedIn, valtidateReview, wrapAsync(reviewController.createNewReview));

// Destroy Route for deleting a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

// Example of a route where reviews are displayed with a listing page
// Assuming you're showing reviews for a listing, and we want to pass isListingPage as true
router.get("/listing/:listingId", wrapAsync(async (req, res) => {
    try {
        // Assuming you are fetching the listing and reviews for the specific listing
        const listing = await listingController.getListingById(req.params.listingId); // Replace with your actual method
        const reviews = await reviewController.getReviewsByListingId(req.params.listingId); // Replace with your actual method

        // Pass isListingPage as false along with the listing and reviews
        res.render("listingWithReviews", {
            isListingPage: false, //flag indicates it's not the listing page
            listing: listing,      // The listing data
            reviews: reviews,      // Reviews for the listing
            title: listing.title,  // Listing title or any other data
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching listing or reviews.");
    }
}));


module.exports = router;
