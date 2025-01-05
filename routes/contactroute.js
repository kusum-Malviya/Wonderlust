const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");

// Route to handle contact form submissions
router.post("/contact", async (req, res) => {
  try {
    // Validate request body
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create a new contact entry
    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });

    // Save to the database
    const savedContact = await newContact.save();

    // Respond with the saved contact data
    return res.status(201).json({
      message: "Contact saved successfully.",
      contact: savedContact,
    });
  } catch (error) {
    console.error("Error saving contact:", error);
    return res.status(500).json({
      error: "An error occurred while saving the contact. Please try again later.",
    });
  }
});

module.exports = router;
