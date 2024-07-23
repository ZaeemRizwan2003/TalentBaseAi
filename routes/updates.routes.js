const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//adding the model file
//const Update = require("../models/update_model");
router.get('/review', async (req, res) => {
    try {
        const updates = await Update.find();
        res.status(200).json(updates);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching updates" });
    }
});


router.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const deleteupdate = await Update.findByIdAndDelete(id);

        if (!deleteupdate) {
            return res.status(404).json({ message: "Update not found.Try Again" });
        }
        res.status(200).json({ message: 'update successfully deleted', deleteupdate });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting update' });
    }
});



module.exports = router;