const express = require('express');
const router = express.Router();


const {registerAUser ,verifyUser, loginUser , getAlluser , updatedUser , getUser} = require('../controller/userController');
const { authMiddleware} = require("../middleware/authMiddleware")

router.post("/register", registerAUser)
// router.post("/authenticate", verifyUser)
router.post("/login", loginUser)
router.get("/getAllUser" ,authMiddleware  , getAlluser)
router.put("/updateUser", authMiddleware, updatedUser)
router.get('/user/:userId', authMiddleware, getUser)


module.exports=router