const allowedOrigins = require('./allowOrigins')

const corsOptionos = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) != -1 || !origin) {
            // if successful
            callback(null, true)
        } else {
            // if fail
            callback(new Error('Not allowed by CORS'))
        }
    },
    Credential: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptionos