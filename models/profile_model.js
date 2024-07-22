const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    }
});

const profileSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    profilepicture: {
        type: String,
        default: 'profilepictures/pp.png'
    },
    phone: {
        type: String,
        required: true
    },
    linkedin: {
        type: String,
        required: true
    },
    personalwebsite: {
        type: String
    },
    location: {
        type: locationSchema,
        required: true
    },
    Currentposition: {
        type: String,
        required: true
    },
    previousexperience: {
        type: String,
    },
    educationalbackground: [
        {
            degree: {
                type: String,
                required: true
            },
            institution: {
                type: String,
                required: true
            },
            graduationYear: {
                type: String,
                required: true
            }
        }],
    skills: {
        type: [String]
    },
    achievements: {
        type: [String]
    },
    awards: {
        type: [String]
    },
    Advisors: [
        {
            Name: {
                type: String,
            },
            linkedinprofile: {
                type: String
            }
        }],
    articles: {
        type: [String]
    },
    interviews: {
        type: [String]
    },
    biography: {
        type: String,
        required: true
    },
    vision_goals: {
        type: [String]
    },
    opento: {
        type: [String],
        enum: ['jobs', 'internships', 'projects', 'collaborations', 'funding', 'acquisition']
    }
}, { collection: 'registered_students' });

module.exports = mongoose.model('Profile', profileSchema);
