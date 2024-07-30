const mongoose = require('mongoose');

// Define the schema for messages
const updateSchema = new mongoose.Schema({
   
    
    message: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the model
module.exports = mongoose.model('Update', updateSchema);
