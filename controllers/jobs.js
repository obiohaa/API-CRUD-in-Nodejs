const Job = require('../models/Job')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require('../errors')

const getAllJobs = async (req, res) => {
    const getThemAll = await Job.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({getThemAll, count:getThemAll.length})
}

const getJob = async (req, res) => {
    const {user: {userId}, params:{id: jobId}} = req
    const getThatJob = await Job.findOne({_id: jobId, createdBy: userId})
    if(!getThatJob){
        throw new NotFoundError('No job with found')
    }
    res.status(StatusCodes.OK).json({getThatJob})
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId
    const jobs = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({jobs})
}


const updateJob = async (req, res) => {
    res.send('update jobs')
}

const deleteJob = async (req, res) => {
    res.send('delete jobs')
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}