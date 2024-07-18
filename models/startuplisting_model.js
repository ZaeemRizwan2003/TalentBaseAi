const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define sub-schemas for complex fields

const foundingTeamSchema = new Schema({
    foundingname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});

const investorSchema = new Schema({
    investorname: {
        type: String
    },
    investingfirm: {
        type: String
    }
});

const advisoryBoardMemberSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    profile: {
        type: String,
        required: true
    }
});

// Define the main schema (startup listing)

const listingSchema = new Schema({
    startupname: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    foundeddate: {
        type: String,
        required: true
    },
    headquarters: {
        type: String,
        required: true
    },
    industrySector: {
        type: String
    },
    businessmodel: {
        type: String,
        required: true
    },
    services: {
        description: {
            type: String,
            required: true
        },
        pictures: {
            type: [String],
            default: []
        }
    },
    targetmarket: {
        type: [String],
        default: []
    },
    fundingstage: {
        type: String
    },
    fundingraised: {
        type: Number
    },
    Revenue: {
        currentrevenue: {
            type: String,
        },
        revenueprojection: {
            type: String
        }
    },
    Investors: {
        type: [investorSchema]
    },
    foundingteam: {
        type: [foundingTeamSchema],
        required: true
    },
    advisoryboard: {
        type: [advisoryBoardMemberSchema],
        required: true
    },
    employeecount: {
        type: Number,
        required: true
    },
    usergrowth: {
        type: String
    },
    customeracquisition: {
        type: String
    },
    retentionrates: {
        type: String
    },
    milestones: {
        type: String,
        required: true
    },
    customertestimonials: {
        type: String
    },
    marketopportunity: {
        type: String
    },
    competitivelandscape: {
        type: String
    },
    elevatorpitch: {
        type: String,
        required: true
    },
    visionstatement: {
        type: String,
        required: true
    },
    useoffunds: {
        type: String,
        required: true
    },
    pressreleases: {
        type: [String]
    },
    mediacoverage: {
        type: [String]
    },
    awardsrecognition: {
        type: [String]
    },
    pitchdeck: {
        type: String,
        required: true
    },
    businessplan: {
        type: String,
        required: true
    },
    videos: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'registered_students',
        required: true
    }
}, { collection: 'Startup_listing' });

module.exports = mongoose.model('StartupListing', listingSchema);
