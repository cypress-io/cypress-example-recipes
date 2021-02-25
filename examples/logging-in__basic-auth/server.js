/* eslint-disable no-console */
const minimist = require('minimist')
const morgan = require('morgan')
const express = require('express')
const bodyParser = require('body-parser')
const basicAuth = require('express-basic-auth')

const app = express()

// get port from passed in args from scripts/start.js
const port = minimist(process.argv.slice(2)).port

// an endpoint replying to HEAD requests
// used by start-server-and-test utility to know when the server is ready
app.head('/', (req, res) => res.send(''))

app.use(morgan('dev'))
// protect all resources with basic authentication
app.use(basicAuth({
  users: { 'jane.lane': 'password123' },
}))

app.post('/echo', bodyParser.json(), (req, res) => {
  console.log('/echo received', req.body)
  res.json(req.body)
})

app.use(express.static('public'))
app.listen(port)
