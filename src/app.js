
require('dotenv').config()

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();


app.use(morgan("dev"))
app.use(helmet())
app.use(compression())

require("./dbs/init.mongodb")
const {checkOverloading} = require("./helpers/check.connect")
checkOverloading()



// app.get("/", (req,res,next) =>{
//     const strCompress = "Hello";

//     return res.status(200).json({
//         message: "Welcome ",
//         // metadata: strCompress.repeat(1000)
//     })
// } )
app.use('/',require("./routes/index"))
// app.use(morgan("combined"))

// morgan("common")
// morgan("short")
// morgan("tiny")

module.exports = app
