const express = require('express');
const router = express.Router();
const Startup = require('../models/startup.models');

// GET endpoint for listing all startups
router.get('/', async (req, res) => {
  try {
    const startups = await Startup.find();
    res.status(200).json(startups);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching startup listings!', error: error.message });
  }
});

// POST endpoint for creating a new startup listing
router.post('/liststartups/:id', async (req, res) => {
  const id = req.params.id;
  const values = req.body;
  try {
    const lists = new Startup({
      ...values,
      createdBy: id
    });
    await lists.save();

    res.status(201).json({
      message: 'Startup listing created successfully',
      data: lists
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating the listing for your startup!',
      error: error.message
    });
  }
});

// PUT endpoint for updating a startup listing
router.put('/liststartups/:id', async (req, res) => {
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

// DELETE endpoint for deleting a startup listing
router.delete('/liststartups/:id', async (req, res) => {
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



// fetch startups based on industory sector
router.post('/search', async (req, res) => {
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
