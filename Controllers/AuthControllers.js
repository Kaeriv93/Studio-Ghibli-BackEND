const UserModel = require('../models/User')
const jwt = require('jsonwebtoken')
const maxAge = 3*24*60*60

const createToken = (id) =>{
    return jwt.sign({id},'secret key',{
        expiresIn: maxAge,
    })
}

module.exports.register = async (req,res,next) =>{ try{
    const {email,password,firstName,lastName,username} = req.body
    const user = await UserModel.create({email,password,firstName,lastName,username})
    const token = createToken(user._id)
    res.cookie('jwt', token,{
        withCredentials:true,
        httpOnly:false,
        maxAge: maxAge * 1000,
    })
    res.status(201).json({user:user._id, created:true})
}catch(err){
    console.log(err)
    req.error= error
    res.json({errors, created:false})
}}

module.exports.login = async (req,res,next) =>{}