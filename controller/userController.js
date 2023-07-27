const User = require('../model/userModel')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const file = require("../middleware/aws")


const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value != "string") return false;
    return true;
};

const  verifyUser = async(req, res, next)=> {
    try {

        const { email } = req.method == "GET" ? req.query : req.body;

        // check the user existance
        let exist = await UserModel.findOne({ email });
        if (!exist) return res.status(404).send({ error: "Can't find User!" });
        next();

    } catch (error) {
        return res.status(404).send({ error: "Authentication Error" });
    }
}

const registerAUser = async (req, res) => {
    try {
        // const data = req.body
        // const {} = data
        const email = req.body.email

        const findUser = await User.findOne({ email: email })


        if (findUser) {
            if (findUser.firstName == req.body.firstName) {
                return res.status(200).send({ message: "First name already exist with this email" })
            }

            if (findUser.lastName == req.body.lastName) {
                return res.status(200).send({ message: "Last name already exist with this email" })
            }

            if (findUser.mobile == req.body.mobile) {
                return res.status(200).send({ message: "Mobile no already exist with this email" })
            }

            if (findUser.DOB == req.body.DOB) {
                return res.status(200).send({ message: "This DOB already exist with this email" })
            }

        }
        else {

            // let date = req.body.DOB;
            // let newDate = date.toString().split('T')[0];
            // req.body.DOB = newDate

            const files = req.files;
            //if (!files || !files.length > 0) return res.status(400).send({ status: false, message: "please enter profileImage" })
            const myFile = files[0]
            
            //********uploading image to aws*******/
            const uploadImage = await file.uploadFile(myFile)

            req.body.profileImage = uploadImage;
            if (!req.body.profileImage) return res.status(400).send({ status: false, message: "please add profile Image" })

            const bcryptPassword = await bcrypt.hash(req.body.password, 10)
            req.body.password = bcryptPassword

            const createUser = await User.create(req.body)


            res.status(201).send({ status: true, message: "User Created Successfully", createUser })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}


// const loginUser = async (req, res) => {
//     try {
//         let { email, password } = req.body;
//         let findUser = await User.findOne({ email: email });
//         if (!findUser) return res.status(400).send({ status: false, message: "emailId is not present in db" });
//         if (findUser && (await findUser.isPasswordMatched(password))) {
//             res.status(200).send({ status: true, msg: "Login Succesfully", token: generateToken(findUser._id), roles: findUser?.roles, username: findUser?.firstName + " " + findUser?.lastName, user_image: findUser?.user_image })
//         } else {
//             throw new Error("Invalid Credentials")
//         }
//     }
//     catch (err) {
//         return res.status(500).send({ status: false, message: err.message })
//     }
// }
const loginUser = async function (req, res) {
    try{
    let { email, password } = req.body;
    
    if (!isValid(email)) return res.status(400).send({ status: false, message: "please enter email in string format" })
    if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) return res.status(400).send({ status: false, message: "please enter valid email" })

    // if (!isValid(password)) return res.status(400).send({ status: false, message: "please enter password in string format" })
    //     if (!/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(password)) return res.status(400).send({ status: false, message: "invalid password" })

    
    let myUser = await User.findOne({ email: email});
    if(!myUser)return res.status(200).send({ status: false, message: "emailId is not present in db" });
    
    bcrypt.compare(password, myUser.password ,function(err, result) {
       if (result) {
        let token = jwt.sign({
            userId: myUser._id.toString()
        }, "group09",
            {
                expiresIn: "10d"
            });
    
        return res.status(200).send({ status: true, message: "success", myUser, token: token })
        
       } 
       return res.status(200).send({status: false , message:"wrong password"})

     });
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }}

const updatedUser = async (req, res) => {
    try {
        const id = req.user
        // console.log(id)
        
        const findUser = await User.findByIdAndUpdate(id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobile: req.body.mobile,
            profileImage : req.body.profileImage,
            address: req.body.address,
            gender: req.body.gender
        }, {
            new: true
        })
        return res.status(200).send({ status: true, msg: "Profile Upsted Succesfully", findUser })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getAlluser = async function (req, res) {

    try {
        let data = await User.find()
        return res.send({ status: true, message: "All User Fetched Succesfully", data })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getUser = async function (req, res) {
    try {
        
         const userId = req.params.userId;
        if (!mongoose.isValidObjectId(userId)) return res.status(400).send({ msg: "inavalid id format" })
        if (req.user._id != userId) return res.status(403).send({ status: false, message: "you are not authorized" })

        const user = await User.findOne({ _id: userId })

        return res.status(200).send({ status: true, message: "User profile details", data: user });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};



module.exports = { verifyUser ,registerAUser, loginUser, getAlluser, updatedUser, getUser }