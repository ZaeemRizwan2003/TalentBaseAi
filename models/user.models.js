const express = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({

    profilepicture: {
        type: String,
        default: 'abc.png'
    },
    username: {
        type: String,
       
    },
    email: {
        type: String,
        unique:true,

    },

    password: {
        type: String,

    },
    role: {
        type: String,

    },


});
const user= mongoose.model('UserInfo', userSchema);

module.exports =user