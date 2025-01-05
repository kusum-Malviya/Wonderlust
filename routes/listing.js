const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const wrapAsync = require('../utils/wrapAsync.js');  // Appending Wrap Async Function
const {isLoggedIn, isOwner, validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');

router.route("/")
    .get( wrapAsync(listingController.index)) // Index Route
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.createListing)
    ); // Create Route
//router.get("/new", isLoggedIn, listingController.renderNewForm); // Create : New Route

router.get("/new", isLoggedIn, async (req, res) => {
    try {
        // Fetch any necessary data for the new form, if required
    

        // Render the "new" form with relevant data and `isListingPage` set to true
        res.render("listings/new", {
            isListingPage: false, //indicating this is the listing page  // Example data, can be removed if not relevant
            title: "Create New Listing", // Page title for the new form
            body: "Fill in the details for your new listing", // Body content for display
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading new listing form.");
    }
});


router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // Show Route (Read Operation)
    .put(
        isLoggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.updateListing)
    ) // Update Route
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.destroyListing)
    ); // Destroy/DELETE Route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Add `isListingPage` to the route for listing page
// Listing route
// Listing Route
router.get("/", async (req, res) => {
    try {
        const listings = await listingController.getAllListings(); // Example, update with your actual method

        // Pass `isListingPage` as true when rendering the listing page
        res.render("listing", {
            isListingPage: true,   // Pass this flag as true
            listings: listings,    // Your listings or other data
            title: "Listing Page",  // Set page title
            body: "Content for the listing page"  // Example body content, modify as per your needs
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching listings.");
    }
});



module.exports = router;
