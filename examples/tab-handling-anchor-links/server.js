const path = require('path')
const minimist = require('minimist')
const express = require('express')
const app = express()

// get port from passed in args from scripts/start.js
const port = minimist(process.argv.slice(2)).port

app.use(express.static('.'))
app.use('/node_modules', express.static(path.join(__dirname, '..', '..', 'node_modules')))

app.listen(port)
