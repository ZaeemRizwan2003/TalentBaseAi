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

// POST endpoint to create a startup with just its name and logo
router.post('/createstartup', authMiddleware, async (req, res) => {
  const { startupname, logo } = req.body;

  // Retrieve user ID from session
  const userId = req.session.userId; // Ensure userId is set during login

  if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
  }

  if (!startupname || !logo) {
      return res.status(400).json({ message: 'Startup name and logo are required!' });
  }

  try {
      // Create a new startup with just the name and logo
      const startupListing = new Startup({
          startupname,
          logo,
          createdBy: userId
      });

      await startupListing.save();

      res.status(201).json({
          message: 'Startup created successfully with name and logo only',
          data: startupListing
      });
  } catch (error) {
      res.status(500).json({
          message: 'Error creating the startup!',
          error: error.message
      });
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

router.put('/liststartups/:id', authMiddleware, async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  try {
    // Find the startup by ID and update it with the new data
    const updatedStartup = await Startup.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set to update only the provided fields
      { new: true, runValidators: true } // Return the updated document and validate it against the schema
    );

    // If the startup isn't found, return a 404 error
    if (!updatedStartup) {
      return res.status(404).json({ message: 'Startup listing not found!' });
    }

    // Respond with the updated startup data
    res.status(200).json({
      message: 'Startup listing updated successfully',
      data: updatedStartup
    });
  } catch (error) {
    // Handle any errors that occur during the update process
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

// Get all startup names and logos for the logged-in user
router.get('/userstartups', authMiddleware, async (req, res) => {
  const userId = req.session.userId; // Retrieve the user ID from the session

  if (!userId) {
      return res.status(401).json({ message: 'Unauthorized. User not logged in.' });
  }

  try {
      const startups = await Startup.find({ createdBy: userId }).select('startupname logo');
      res.status(200).json(startups);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching startups!', error: error.message });
  }
});

// Get all startup names and logos for a specific user ID passed in the URL
router.get('/userstartups/:userId', authMiddleware, async (req, res) => {
  const { userId } = req.params; // Retrieve the user ID from the URL parameter

  try {
      const startups = await Startup.find({ createdBy: userId }).select('startupname logo');
      res.status(200).json(startups);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching startups!', error: error.message });
  }
});

// Get all details of a startup by its ID
router.get('/startup/:startupId', authMiddleware, async (req, res) => {
  const { startupId } = req.params; // Retrieve the startup ID from the URL parameter

  try {
      const startup = await Startup.findById(startupId);

      if (!startup) {
          return res.status(404).json({ message: 'Startup not found!' });
      }

      res.status(200).json(startup);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching startup details!', error: error.message });
  }
});



module.exports = router;
