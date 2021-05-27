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