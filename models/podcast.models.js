const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const podacstSchema = new Schema({
    
    email: {
        type: String,
        
        required: true
    },
    request: {
        type: String,
        
    },
    
}, { collection: 'PodcastServices' });

module.exports = { podacstSchema}