require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route/routes.js');
const AWS = require('aws-sdk')
const  mongoose = require('mongoose');
const passport = require('passport');
const MongoStore = require('connect-mongo');

const app = express();
const session = require("express-session");
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors())



const multer= require("multer");
const googleRouter = require('./route/googleRouter');



app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())

app.use(session({
    resave:false,
    saveUninitialized:false,
    secret:"group09",
    store: MongoStore.create(
        {
            mongoUrl: process.env.MONGO_URL,
            ttl: 12 * 60 *60
        }
    )
}))

app.set("trust proxy", 1)
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req,res)=>{
    res.send("hello world")
})

// app.get("/", (req,res)=>{
//     res.send(`<a href="http://localhost:4000/google">Login With Google</a>`)
// })
app.use("/", googleRouter)


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
}) 
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )



app.use('/', route);

app.listen(process.env.PORT || 9000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 9000))
});