const express = require('express');
const router = express.Router();
const Startup = require('../models/startup.models');
const authMiddleware = require('../middleware/auth');


router.get('/',authMiddleware, async (req, res) => {
  try {
    const startups = await Startup.find();
    res.status(200).json(startups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching startup listings!', error: error.message });
  }
});


// POST endpoint to create a startup listing
router.post('/liststartups',authMiddleware, async (req, res) => {
  const values = req.body;

  // Retrieve user ID from session
  const userId = req.session.userId; // Ensure userId is set during login

  if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
  }

  try {
      // Create a new startup listing with the logged-in user ID
      const startupListing = new Startup({
          ...values,
          createdBy: userId
      });

      await startupListing.save();

      res.status(201).json({
          message: 'Startup listing created successfully',
          data: startupListing
      });
  } catch (error) {
      res.status(500).json({
          message: 'Error creating the listing for your startup!',
          error: error.message
      });
  }
});


router.put('/liststartups/:id',authMiddleware, async (req, res) => {
  const id = req.params.id;
  const values = req.body;
  try {
    const updatedStartup = await Startup.findByIdAndUpdate(id, values, { new: true });

    if (!updatedStartup) {
      return res.status(404).json({ message: 'Startup listing not found!' });
    }

    res.status(200).json({
      message: 'Startup listing updated successfully',
      data: updatedStartup
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating the listing for your startup!',
      error: error.message
    });
  }
});


router.delete('/liststartups/:id',authMiddleware, async (req, res) => {
  const id = req.params.id;
  try {
    const deletedStartup = await Startup.findByIdAndDelete(id);

    if (!deletedStartup) {
      return res.status(404).json({ message: 'Startup listing not found!' });
    }

    res.status(200).json({
      message: 'Startup listing deleted successfully',
      data: deletedStartup
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting the listing for your startup!',
      error: error.message
    });
  }
});



router.post('/search',authMiddleware, async (req, res) => {
  console.log('Received search request with startup inustury sector:', req.query.industrySector);
  try {
    // Check if title is an array or a single string
    const title = req.query.industrySector;

    if (!title) {
      return res.status(400).json({ message: 'startup query parameter is required' });
    }

    // Use regular expression for partial matching
    const blogs = await Startup.find({ industrySector: { $regex: title, $options: 'i' } });
    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
