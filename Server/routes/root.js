const express = require('express')
const router = express.Router()
const path = require('path')

// this will only match if the requested route is only a "/" or the index.html
router.get('^/$|/index(.html)?', (req, res) => {
    // up out of route folder. In views folder. call index html
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router