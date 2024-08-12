const express = require('express');
const router = express.Router();
const LearningPath = require('../models/learningpath.models');
const authMiddleware = require('../middleware/auth');

// Create a new learning path
router.post('/add',authMiddleware, async (req, res) => {
  const { programSelection, streamSelection, courseContents, onlineTest, certification } = req.body;

  try {
    const newLearningPath = new LearningPath({
      programSelection,
      streamSelection,
      courseContents,
      onlineTest,
      certification
    });

    const savedLearningPath = await newLearningPath.save();
    res.status(201).json({
      message: 'Learning path created successfully',
      data: savedLearningPath
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create learning path',
      error: error.message
    });
  }
});

// Get a learning path
router.get('/get/:id',authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const learningPath = await LearningPath.findById(id);

    if (!learningPath) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    res.status(200).json({
      message: 'Learning path retrieved successfully',
      data: learningPath
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to retrieve learning path',
      error: error.message
    });
  }
});

// Update a learning path
router.put('/update/:id',authMiddleware, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedLearningPath = await LearningPath.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedLearningPath) {
      return res.status(404).json({ message: 'Learning path not found' });
    }

    res.status(200).json({
      message: 'Learning path updated successfully',
      data: updatedLearningPath
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update learning path',
      error: error.message
    });
  }
});

module.exports = router;
