const nodemailer = require('nodemailer');
const {google} = require('googleapis');

const CLIENT_ID = "150881338783-9pm1p2v98l6sn7ko27la0dggrop7qnct.apps.googleusercontent.com"
const CLIENT_SECRET = "xf9yYyJaROUuKtaHjP_EA42n"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04_05sXmYbiriCgYIARAAGAQSNwF-L9IrqVm4xVWYYVA6IG8oLr0sjtWw7jxvqHXn5I1jrTc03Z4e9VADx1mwulIhs3JVQIHzbfU"



const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({refresh_token : REFRESH_TOKEN});



const sendEmail = async(options)=>{
    try{
        const accessToken = await oAuth2Client.getAccessToken();
        const transport = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                type : 'OAuth2',
                user : 'mdabutahersaikat@gmail.com',
                clientId : CLIENT_ID,
                clientSecret : CLIENT_SECRET,
                refreshToken : REFRESH_TOKEN,
                accessToken : accessToken
            }
        })
        const mailOptions = {
            from : 'Abu Taher Saikat <mdabutahersaikat@gmail.com>',
            to : options.email,
            subject : options.subject,
            text : "Activation for email",
            html : options.message
        }

        const result = await transport.sendMail(mailOptions);
        return result;

    }catch(error){
        return error
    }
}

module.exports = sendEmail;