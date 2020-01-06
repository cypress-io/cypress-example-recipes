/* eslint-disable no-console */
require('rootpath')()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('./_helpers/jwt')
const errorHandler = require('./_helpers/error-handler')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// use JWT auth to secure the api
app.use(jwt())

// api routes
app.use('/users', require('./users/users.controller'))

// global error handler
app.use(errorHandler)

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000

app.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})
