const googleRouter = require("express").Router()
const passport = require("passport")

const User = require('../model/userModel')
const  jwt = require("jsonwebtoken")


googleRouter.get("/login/success", async(req,res)=>{
    
    if(req.user){
        
        const findUser = await User.findOne({email: req.user.email})
        const token = jwt.sign({userId:findUser._id.toString()},"group09" )
        
        console.log(findUser)
        if(findUser){
            res.status(200).send({status: true, 
                msg: "Login Succesfully", 
                token: token,
                roles:findUser?.roles, 
                username: findUser?.firstName +" " + findUser?.lastName , 
                user_image: findUser?.profileImage,
                from: "google" 
            })
        }
    }else{
        return res.status(500).send({msg: "Something went wrong"})
    }
})

googleRouter.get("/login/failed", async(req,res)=>{
    console.log("login failed")
    res.status(401).send({status: false , msg: "Login Failed"})
})

googleRouter.get("/google", 
    passport.authenticate("google",["profile","email"])
)

googleRouter.get("/auth/google/callback",  passport.authenticate("google",{
        successRedirect: "/login/success",
        failureRedirect: "/login/failed"
    })
)

googleRouter.get("/logout", async(req,res)=>{
    req.logout();
    res.redirect("/")
})


module.exports = googleRouter
