const express = require('express');
// const { json } = require('express/lib/response');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const path = require('path')
const cloudinary = require('cloudinary');
const connectDatabase = require('./config/database')


const app = express();
const errorMiddleware = require('./middleware/error');

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config({path:'./config/config.env'})
}

app.use(express.json()); //if not used then console.log(req.body) give : undefined
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());

//Route Imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', order);
app.use('/api/v1', payment);

app.use(express.static(path.join(__dirname,"./build")))

app.get('*', (req,res)=> {
    res.sendFile(path.resolve(__dirname,"./build/index.html"))
})

// Middleware For Error
app.use(errorMiddleware);




// module.exports = app;


// Handling Uncaught Exception
process.on('uncaughtException',err=> {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
}) //if we write this process in below of of code and write console is above of process code so how console error that's the reaseon why we write process in top of our code 
// console.log(Youtube) Handle this error above code do 

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config({path:'./config/config.env'})
}
// Connecting to database
connectDatabase()
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const index = app.listen(process.env.PORT,()=> {
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})


// Unhandled Promise Rejection //means if we write invaild mongo string connection // see video 1hour:17min
process.on('unhandledRejection',err=> {

    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`)

    index.close(()=> {
        process.exit(1);
    })
})





// You do not need express.json() and express.urlencoded()
// for GET Requests or delete requests. We only need it for
// post and put(patch) req

// express.json() is a method inbuilt in express to recognize the
// incoming request object as a json object. this method is called as
// middleware in your application using the
// code: app.use(express.json());
