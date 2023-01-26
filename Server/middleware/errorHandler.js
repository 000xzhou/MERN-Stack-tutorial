const { logEvents } = require('./logger')

// overwrite the default express error handling
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t ${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    // check if the response we receive already have a status code set
    const status = res.statusCode ? res.statusCode : 500    // server error

    res.status(status)

    res.json({ message: err.message })

}

module.exports = errorHandler