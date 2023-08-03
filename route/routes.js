const express = require('express');
const router = express.Router();


const {registerAUser , loginUser , getAlluser , updatedUser , getUser, forgetPasswordToken, resetPassword, updatePassword} = require('../controller/userController');
const { authMiddleware} = require("../middleware/authMiddleware")

router.post("/register", registerAUser)
router.post("/login", loginUser)
router.get("/getAllUser" ,authMiddleware  , getAlluser)
router.put("/updateUser", authMiddleware, updatedUser)
router.get('/user/:userId', authMiddleware, getUser)
router.put('/updatePassword', authMiddleware, updatePassword)
router.post('/user/forgot-password',  forgetPasswordToken)
router.put('/reset-password/:token', resetPassword)


module.exports=router   