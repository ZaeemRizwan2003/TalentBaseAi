const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define sub-schemas for complex fields

const foundingTeamSchema = new Schema({
    foundingname: {
        type: String,
        
    },
    role: {
        type: String,
        
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
        
    },
    profile: {
        type: String,
        
    }
});

// Define the main schema (startup listing)

const listingSchema = new Schema({
    startupname: {
        type: String,
        
    },
    logo: {
        type: String,
        
    },
    foundeddate: {
        type: String,
        
    },
    headquarters: {
        type: String,
        
    },
    industrySector: {
        type: String
    },
    businessmodel: {
        type: String,
        
    },
    services: {
        description: {
            type: String,
            
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
        
    },
    advisoryboard: {
        type: [advisoryBoardMemberSchema],
        
    },
    employeecount: {
        type: Number,
        
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
        
    },
    visionstatement: {
        type: String,
        
    },
    useoffunds: {
        type: String,
        
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
        
    },
    businessplan: {
        type: String,
        
    },
    videos: {
        type: String,
        
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
        
    }
});

const Startup= mongoose.model('Startup', listingSchema);
module.exports =Startup;