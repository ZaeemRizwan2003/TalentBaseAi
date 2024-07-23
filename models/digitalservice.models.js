const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const digitalServiceSchema = new Schema({
    
    email: {
        type: String,
        
        required: true
    },
    request: {
        type: String,
        
    },
    
}, { collection: 'DigitalServices' });

module.exports = { digitalServiceSchema}