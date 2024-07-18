const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    }
}, { collection: 'registered_students' });

module.exports = { StudentSchema }