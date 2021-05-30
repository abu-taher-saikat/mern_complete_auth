const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const expressJwt = require('express-jwt');
const _ = require('lodash');

exports.signup = async (req,res) => {
    const {name, email, password} = req.body ;

    // find and check duplicate image.
    await User.findOne({email}).exec((err, user)=>{
        if(user){
            return res.status(400).json({
                error : 'Email is taken'
            })
        }
        
        // Create the token
        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION,{
            expiresIn : '30m'
        })


        // Try to send email .
        try{
             sendEmail({
                email : email,
                subject : 'Passwrd reset token',
                message : `
                <h1>Pleaser use the following link to activate your account</h1>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>This email may contain sensetive information.</p>
                <p>${process.env.CLIENT_URL}</p>
            `
            })

            res.status(200).json({
                message : `Email has been sent to ${email}. Follow the instuction to active you account.`
            })
        }catch(error){
            // console.log(error.message)
            res.status(401).json({
                success : false,
                message : error.message
            })
        }
    });
}



exports.accountActivation = (req, res) => {
    const {token} = req.body;

    if(token){
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION , function(err, decoded){
            if(err){
                console.log('JWT Verify In Account Activation Error', err);
                return res.status(401).json({
                    error : 'Expired link. Signup again.'
                })
            }

            const {name, email, password} = jwt.decode(token);
            const user = new User({name, email, password});

            user.save((err, user)=>{
                if(err){
                    console.log('Save User in account activation error', err);

                    return res.status(401).json({
                        error : 'Error saving user in database. Try signup again.'
                    })
                }

                return res.json({
                    message : 'Signup success. Please signin'
                })


            })
        })
    }else{
        return res.json({
            message : 'Something went wrong. Try Again'
        })
    }
}




exports.signin = (req, res) => {
    const {email, password} = req.body;

    // Check if user exist
    User.findOne({email}).exec((err, user)=>{
        if(err || !user){
            return res.status(400).json({
                error : 'User with that email does not exist. Please signup'
            })
        }

        // authenticate 
        if(!user.authenticate(password)){
            return res.status(400).json({
                error : 'Email and password do not match'
            })
        }

        // Generate a token and send to client
        const token = jwt.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn : '7d'})
        const {_id, name, email, role} = user ;

        return res.json({
            token,
            user : {_id, name, email, role}
        })
    })
}




/**
 * this is not working due to express-jwt. but i can make protect
 * and admin route easily with jsonwebtoken. */ 
// exports.requireSignin = (req, res , next) => expressJwt({
//     secret : process.env.JWT_SECRET //req.user._id
// })


// exports.adminMiddleware = (req,res,next) => {
//     User.findById({_id : req.user._id}).exec((err, user)=> {
//         if(err || !user){
//             return res.status(400).json({
//                 error : 'User not found.'
//             })
//         }

//         if(user.role !== 'admin'){
//             return res.status(400).json({
//                 error : 'Admin resource . Access denied..'
//             })
//         }

//         req.profile = user;
//         next();
//     })
// }


exports.forgotPassword = (req,res) => {
    const {email} = req.body ;

    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error : 'User with that email does not exist.'
            });
        }

                
        // Create the token
        const token = jwt.sign({_id : user._id}, process.env.JWT_RESET_PASSWORD,{
            expiresIn : '10m'
        })


        return user.updateOne({resetPasswordLink : token}, (err, success) => {
            if(err){
                console.log('Resetp password link error', err);
                res.status(400).json({
                    error : 'Database connection errorn on user password forgot request'
                })
            }else{
                // Try to send email .
                try{
                        sendEmail({
                        email : email,
                        subject : 'Password reset Link',
                        message : `
                        <h1>Pleaser use the following link to reset your password</h1>
                        <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                        <hr />
                        <p>This email may contain sensetive information.</p>
                        <p>${process.env.CLIENT_URL}</p>
                    `
                    })
        
                    res.status(200).json({
                        message : `Email has been sent to ${email}. Follow the instuction to Change your password.`
                    })
                }catch(error){
                    // console.log(error.message)
                    res.status(401).json({
                        success : false,
                        message : error.message
                    })
                }

            }
        })


    })
}


exports.resetPassword = (req,res) => {
    const {resetPasswordLink, newPassword} = req.body ;

    if(resetPasswordLink){
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded){
            if(err){
                return res.status(400).json({
                    error : 'Expired link. Try again'
                })
            }

            User.findOne({resetPasswordLink}, (err, user)=>{
                if(err || !user){
                    return res.status(400).json({
                        error : 'Something went wrong . Try Later'
                    })
                }

                const updatedFields = {
                    password : newPassword,
                    resetPasswordLink : ''
                }

                user = _.extend(user, updatedFields) // lodash heper extends.. just change the named values. and other things will be the same.
                // console.log(`user`, user)
                user.save((err, result) => {
                    if(err){
                        return res.status(400).json({
                            error : 'Error resetting user password'
                        })
                    }

                    return res.json({
                        message : `Great! Now you can login with our new password`
                    })
                })
            })
        })
    }
}