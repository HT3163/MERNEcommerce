class ErrorHander extends Error {  // 'Error' is a node byDefault class  //class first name always capital remember
    
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this,this.constructor);
    }

}

module.exports = ErrorHander

