const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const podacstSchema = new Schema({
    userId: {
        type: String,
        
    },
    email: {
        type: String,
        
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    request: {
        type: String,
        
    },
    
}, { collection: 'PodcastServices' });

module.exports = mongoose.model('PodcastServiceRequest', podacstSchema);