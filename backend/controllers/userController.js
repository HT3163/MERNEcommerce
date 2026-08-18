
const ErrorHander = require('../utils/errorhander');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto')
const cloudinary = require('cloudinary')
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

// Register a User 
exports.registerUser = catchAsyncErrors( async(req,res,next)=> {

    const myCloud = await cloudinary.v2.uploader.upload(
        req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
        }
    )

    const {name, email, password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });

    sendToken(user,201,res);

})

// Login User
exports.loginUser = catchAsyncErrors(async (req,res,next)=> {

    const {email,password} = req.body;

    // Checking if user has given password and email both

    if(!email || !password) {
        return next(new ErrorHander("Please Enter Email & Password",400))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){return next(new ErrorHander("Invalid email and password",401))}

    if((user.authProvider === "google" || user.googleId) && !user.password) {
        return next(new ErrorHander("This account uses Google Sign-In. Please continue with Google.",400))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHander("Invalid email or password",401))
    }

    sendToken(user,200,res);

})

exports.getGoogleClientId = catchAsyncErrors(async (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID) {
        return next(new ErrorHander("Google Sign-In is not configured", 500));
    }

    res.status(200).json({
        success: true,
        clientId: process.env.GOOGLE_CLIENT_ID,
    });
});

exports.googleAuth = catchAsyncErrors(async (req, res, next) => {
    const { credential } = req.body;

    if (!credential) {
        return next(new ErrorHander("Missing Google credential", 400));
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
        return next(new ErrorHander("Google Sign-In is not configured", 500));
    }

    let ticket;

    try {
        ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
    } catch (error) {
        const message = error && error.message ? error.message.toLowerCase() : "";
        const authMessage = message.includes("expired")
            ? "Expired Google token"
            : "Invalid Google token";

        return next(new ErrorHander(authMessage, 401));
    }

    const payload = ticket.getPayload();

    if (!payload) {
        return next(new ErrorHander("Invalid Google token", 401));
    }

    const {
        sub,
        email,
        name,
        picture,
        email_verified: emailVerified,
    } = payload;

    if (!sub || !email) {
        return next(new ErrorHander("Invalid Google token", 401));
    }

    if (!emailVerified) {
        return next(new ErrorHander("Unverified email", 400));
    }

    const googleUser = await User.findOne({ googleId: sub });
    const emailUser = await User.findOne({ email });

    if (googleUser && emailUser && googleUser._id.toString() !== emailUser._id.toString()) {
        return next(new ErrorHander("Google account already linked to another account", 409));
    }

    if (emailUser && (emailUser.authProvider || "local") === "local" && !emailUser.googleId) {
        return next(
            new ErrorHander(
                "An account with this email already exists. Please sign in with email and password.",
                409
            )
        );
    }

    let user = googleUser || emailUser;

    if (!user) {
        user = await User.create({
            name: name || email.split("@")[0],
            email,
            googleId: sub,
            authProvider: "google",
            profilePicture: picture,
            avatar: picture ? { url: picture } : undefined,
        });
    } else {
        user.googleId = user.googleId || sub;
        user.authProvider = "google";
        user.profilePicture = picture || user.profilePicture;

        if (name) {
            user.name = name;
        }

        if ((!user.avatar || !user.avatar.public_id) && picture) {
            user.avatar = {
                public_id: user.avatar ? user.avatar.public_id : undefined,
                url: picture,
            };
        }

        await user.save({ validateBeforeSave: false });
    }

    sendToken(user, 200, res);
});


// Logout User
exports.logout = catchAsyncErrors(async(req,res,next)=>  {
    res.cookie("token",null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "Logged OUT",
    })

})

// Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req,res,next)=> {

    const user = await User.findOne({email:req.body.email});
    // console.log("this is forgot user detail: ",user)

    if(!user) {return next(new ErrorHander("User not found", 404))};

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    // const resetPasswordUrl = `http://localhost/api/v1/password/reset/${resetToken}`;
    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`; //this is for backend 
    // const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;    //this is for frontend
    console.log(resetPasswordUrl)

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it`;

    try {

        await sendEmail({
            email:user.email,
            subject: `Ecommerce Password Recovery`,
            message,
        });

        res.status(200).json({
            success:true,
            message:`Email sent to ${user.email} successfully`,
        })

    } catch (error) {
        user.getResetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHander(error.message,500));
    }

})


exports.resetPassword = catchAsyncErrors(async (req,res,next) => {

    // creating token hash
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    })

    if(!user){
        return next(new ErrorHander('Reset Password Token is invalid or has been expired',400))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHander("Password dows not match with confirm password",400))
    }

    user.password = req.body.password

    user.getResetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res)

})

// Get User Details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=> {

    const user = await User.findById(req.user.id);
   
    res.status(200).json({ 
        success:true,
        user,
    })
 
})


// update User 
exports.updatePassword = catchAsyncErrors(async(req,res,next)=> {

    const user = await User.findById(req.user.id).select("+password");

    if((user.authProvider === "google" || user.googleId) && !user.password) {
        return next(new ErrorHander("Password login is not enabled for this Google account.",400))
    }

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    
    if(!isPasswordMatched) {
        return next(new ErrorHander("Old Password is incorrect",400))
    }
    
    if(req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHander("Password dows not match with confirm password",400))
    }

    user.password = req.body.newPassword
    await user.save();

    sendToken(user,200,res)
 
})


// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    if(req.body.avatar && req.body.avatar !== '' && req.body.avatar !== 'undefined'){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar && user.avatar.public_id ? user.avatar.public_id : null;

        if(imageId){
            await cloudinary.v2.uploader.destroy(imageId);
        }

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        })

    
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        };

        newUserData.profilePicture = myCloud.secure_url;

    }
    
  
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });

});


// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();
  
    res.status(200).json({
      success: true,
      users,
    });
});


// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);
  
    if (!user) {
      return next(
        new ErrorHander(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
});


// update User Role --admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });

});


// Delete User --admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    
    const user = User.findById(req.params.id);

    // We will remove cloudinary later

    if (!user) {
        return next(new ErrorHander(`User does not exist with Id: ${req.params.id}`, 400))
    }

    await user.remove();
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });

});
