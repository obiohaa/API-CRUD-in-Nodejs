const userModel = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors/index')

const register = async (req, res) => {
    const user = await userModel.create({...req.body})
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ User: {name: user.name}, token })
}

const login = async (req, res) => {
    const {email, password} = req.body
    
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await userModel.findOne({email})
    if(!user) {
        throw new UnauthenticatedError('User does not exist, please register')
    }
    const comparedPassword = await user.comparePassword(password)
    if(!comparedPassword){
        throw new UnauthenticatedError('Please provide a valid password')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ User: {name: user.name}, token })
}

module.exports = {
    register,
    login
}