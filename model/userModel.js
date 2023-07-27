const mongoose = require("mongoose");



const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },

    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    profileImage: {
        type: String
    },
    DOB: {
        type:  String,
    },
    gender:{
        type: String,
        required: true,
        enum: ["Male","Female", "Other"]
    },

    password: {
        type: String,
        required: true
    },
    address:{
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)



  