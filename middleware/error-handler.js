// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const errorHandlerMiddleware = (err, req, res, next) => {

  //custom error
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again later',
  }

  //errors that are instance of CustomAPIError i.e bad-request, not-found, and unauthenticated
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  if(err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((items) => items.message ).join(', and ')
    customError.statusCode = 400
  }

  if(err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
    customError.statusCode = 400
  }

  if(err.name === 'CastError'){
    customError.msg = `The id ${err.value} is not found`
    customError.statusCode = 404
  }
  //this shows the internal server error for investigation uncomment to see error details.
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })

  return res.status(customError.statusCode).json({msg: customError.msg})

}

module.exports = errorHandlerMiddleware
