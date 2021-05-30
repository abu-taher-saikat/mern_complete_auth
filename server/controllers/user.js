const User = require('../models/user');

exports.read = (req,res) => {
    const userId = req.params.id;
    console.log(`userId`, userId);

    User.findById(userId).exec((err, user) => {
        if(err || !user){
            return res.status(400).json({
                error : 'User not found'
            })
        }
        user.hashed_password = undefined
        user.salt = undefined
        res.json(user)
    })
}


exports.update = (req,res) => {
    const id = req.params.id;
    const {name, password} = req.body;


    User.findOne({_id : id},(err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error : 'User not found'
            })
        }

        if(!name){
            return res.status(400).json({
                error : 'Name is reqired.'
            })
        }else {
            user.name = name
        }

        if(password){
            if(password.length < 6){
                return res.status(400).json({
                    error : 'Passowr should be min 6 characters long.'
                })
            }else{
                user.password = password
            }
        }

        user.save((err, updatedUser) => {
            if(err){
                return res.status(400).json({
                    error : 'User update failed'
                })
            }
            updatedUser.hashed_password = undefined
            updatedUser.salt = undefined
            res.json(updatedUser)
        })

        console.log(req.user);

    })
}