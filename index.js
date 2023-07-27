const express = require('express');
const bodyParser = require('body-parser');
const route = require('./route/routes.js');
// const dotenv = require('dotenv').config();
const AWS = require('aws-sdk')
const  mongoose = require('mongoose');
const app = express();
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors())


const multer= require("multer");



app.use(bodyParser.urlencoded({ extended: true }));
app.use( multer().any())

mongoose.connect("mongodb+srv://snehal_3497:snehal_3497@atlascluster.q9xoryr.mongodb.net/Delostyle?retryWrites=true&w=majority", {
    useNewUrlParser: true
}) 
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/', route);

app.listen(process.env.PORT || 9000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 9000))
});