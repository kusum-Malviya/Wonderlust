const express = require('express');
const router = express.Router();
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })


const wrapAsync = require('../utils/wrapAsync.js')           // Appending Wrap Async Function
const {isLoggedIn,isOwner,validateListing} = require('../middleware.js');
const listingController = require('../controllers/listings.js');

router.route("/")
    .get( wrapAsync(listingController.index)) // Index Route
    .post(  isLoggedIn,
            upload.single('listing[image]'),
            validateListing,
            wrapAsync(listingController.createListing)
        );//Create Route

router.get("/new",isLoggedIn,listingController.renderNewForm); // Create : New Route

router.route("/:id")
    .get(   wrapAsync(listingController.showListing))//Show Route (Read Operation)
    .put(   isLoggedIn,
            isOwner,
            upload.single('listing[image]'),
            validateListing,
            wrapAsync(listingController.updateListing)
        )//Update Route
    .delete(    isLoggedIn,
                isOwner,
                wrapAsync(listingController.destroyListing)
            );//Destroy/DELETE Route


  
// Edit Route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports = router;