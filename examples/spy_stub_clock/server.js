const _          = require('lodash')
const minimist   = require('minimist')
const morgan     = require('morgan')
const bodyParser = require('body-parser')
const session    = require('express-session')
const express    = require('express')

const fruits     = require('./fruits')
const app        = express()

// get port from passed in args from scripts/start.js
const port = minimist(process.argv.slice(2)).port

app.use(express.static(__dirname))
app.use(morgan("dev"))

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`)
})

app.get('/favorite-fruits', (req, res) => {
  res.json(_.sampleSize(fruits, 5))
})

app.listen(port)
