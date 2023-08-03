const mongoose = require("mongoose");
const crypto = require('crypto')
const bcrypt = require('bcrypt')


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
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires: Date,
    

}, { timestamps: true })

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString("hex")
    console.log("resetToken" , resetToken)
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    
    this.passwordResetExpires = Date.now() + 30*60*1000
    
    return (resetToken)
    
}    


module.exports = mongoose.model('User', userSchema)



  