const ErrorHander = require('../utils/errorhander');

module.exports = (err,req,res,next)=> {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error"

    // Wrong Mongodb Id Error
    if (err.name === "CastError") { //video : 1:22:10
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHander(message,400)
    }

    // Mongoose duplicate key error
    if(err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHander(message,400);
    }

    // Wrong entered JWT token error
    if(err.name === "jsonWebTokenError") {
        const message = `Json Web Token is invalid, try again`;
        err = new ErrorHander(message,400);
    }

    // JWT token Expired error
    if(err.name === "TokenExpiredError") {
        const message = `Json Web Token is Expired, try again`;
        err = new ErrorHander(message,400);
    }


    res.status(err.statusCode).json({
        success:false,
        message:err.message, //err.stack give line number where error occured
        error: err.stack
    }) 
}