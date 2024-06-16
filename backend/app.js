const express = require('express');
// const { json } = require('express/lib/response');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');
const path = require('path')


const app = express();
const errorMiddleware = require('./middleware/error');

//config
if(process.env.NODE_ENV!=="PRODUCTION"){
    require('dotenv').config({path:'backend/config/config.env'})
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

app.use(express.static(path.join(__dirname,"../frontend/build")))

app.get('*', (req,res)=> {
    res.sendFile(path.resolve(__dirname,"../frontend/build/index.html"))
})

// Middleware For Error
app.use(errorMiddleware);

module.exports = app;




// You do not need express.json() and express.urlencoded()
// for GET Requests or delete requests. We only need it for
// post and put(patch) req

// express.json() is a method inbuilt in express to recognize the
// incoming request object as a json object. this method is called as
// middleware in your application using the
// code: app.use(express.json());
