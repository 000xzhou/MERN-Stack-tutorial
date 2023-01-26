require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.Node_ENV)
mongoose.set('strictQuery', true);
connectDB()

app.use(logger)

// make our api(this server) available to the public.
// create cores options in config folder
app.use(cors(corsOptions))

// let app receive and parse json data
app.use(express.json())

app.use(cookieParser())

// find css/img files
app.use('/', express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/root'))
app.use('/users', require('./routes/userRoutes'))
app.use('/notes', require('./routes/noteRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        // if the html isn't found
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        // if the json isn't found
        res.json({ message: '404 NOt Found' })
    } else {
        // anything else
        res.type('txt').send('404 Not Found')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connnected to MongoDB')
    app.listen(PORT, () => console.log(`sever running on port ${PORT}`))
})

mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err / syscall}\t${err.hostname}`, 'mongoErrLog.log')
})