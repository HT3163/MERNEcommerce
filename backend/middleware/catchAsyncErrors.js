
module.exports = (theFunc) => (req,res,next) => {
    Promise.resolve(theFunc(req,res,next)).catch(next);  //see video 1hour:12min:44sec  //Promise is js build-in class
};

