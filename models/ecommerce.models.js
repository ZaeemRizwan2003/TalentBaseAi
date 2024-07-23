const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define sub-schemas for complex fields

const feedbackSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const offerSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    replies: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

// Define the main schema

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
   
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    feedback: {
        type: [feedbackSchema],
        default: []
    },
    offers: {
        type: [offerSchema],
        default: []
    }
}, { collection: 'ecommerce_products' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
