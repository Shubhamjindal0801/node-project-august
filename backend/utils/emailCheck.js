const UserSchema = require('../models/User')

const emailCheck = async (email) => {
    let userData
    try {
        userData = await UserSchema.findOne({ email: email })
    }catch(err){
        res.status(400).send({
            status:400,
            message:'Db Error',
            data:err
        })
    }
    if(userData) return 'E'
    else return true
}


module.exports = {emailCheck}