const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for digital service requests
const digitalServiceSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    request: {
        type: String,
        required: true
    },
}, { collection: 'DigitalServices' });

// Create and export the model
const DigitalServiceRequest = mongoose.model('DigitalServiceRequest', digitalServiceSchema);
module.exports = DigitalServiceRequest;
