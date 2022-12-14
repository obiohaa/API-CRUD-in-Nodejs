const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    const getThemAll = await Job.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({getThemAll, count:getThemAll.length})
}

const getJob = async (req, res) => {
    //Nested destructuring
    const {user: {userId}, params:{id: jobId}} = req
    const getThatJob = await Job.findOne({_id: jobId, createdBy: userId})
    if(!getThatJob){
        throw new NotFoundError('No job with this user is found')
    }
    res.status(StatusCodes.OK).json({getThatJob})
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const jobs = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({jobs})
}


const updateJob = async (req, res) => {
    //Nested destructuring
    const { body: {company, position}, user: {userId}, params: {id:jobId} } = req

    if (company === '' || position === ''){
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    const updateJob = await Job.findByIdAndUpdate({_id: jobId, createdBy: userId}, req.body, {new: true, runValidator: true})
    if(!updateJob){
        throw new NotFoundError('No job found to update')
    }
    res.status(StatusCodes.OK).json({updateJob})
}

const deleteJob = async (req, res) => {
    const {user: {userId}, params:{id: jobId}} = req
    const deleteJob = await Job.findByIdAndDelete({_id:jobId, createdBy:userId})
    if(!deleteJob){
        throw new NotFoundError('this user does not exist')
    }
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}