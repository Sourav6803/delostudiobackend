const passport = require('passport') 
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../model/userModel')

passport.use(new GoogleStrategy(
    {
    clientID: "448794737196-gvievq4jovbro0og1rbmbdhk7brbeocj.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL:"/auth/google/callback",
    scope: ["profile","email"]
    },
    async function(accesstoken,refreshToken , profile , cb){
        
        let data = profile?._json
        const user = await User.findOne({email: data.email})
        
        if(user){
            return await cb(null , user)
        }else{
            const newUser = await User.create({
                firstname : data.name,
                lastname: data.given_name,
                user_image: data.picture,
                email: data.email,
                roles: "user"
            })
            return await cb(null , newUser)
        }
    }
    
))

passport.serializeUser((user,done)=>{
    done(null , user)
})
passport.deserializeUser((user,done)=>{
    done(null , user)
})