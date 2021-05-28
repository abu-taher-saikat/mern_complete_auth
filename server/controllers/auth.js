const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');


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
                success : true,
                data : 'Email sent'
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