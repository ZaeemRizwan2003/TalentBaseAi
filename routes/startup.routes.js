const express = require('express');
const router = express.Router();
const Startup=require('../models/startup.models')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
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
module.exports = router;