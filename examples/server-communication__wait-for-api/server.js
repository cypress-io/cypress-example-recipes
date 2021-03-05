/* eslint-disable no-console */
const path = require('path')
const express = require('express')
const morgan = require('morgan')

const app = express()
const port = 7668

app.use(morgan('dev'))
app.use(express.static('public'))

const staticFolder = path.join(__dirname, 'public')

app.get('/', (req, res) => {
  res.sendFile(`${staticFolder}/index.html`)
})

let greetingRespondsAfter = +new Date()

app.post('/reset-api', () => {
  const apiDelay = Math.random() * 4000 + 1000

  console.log('resetting api, it will respond in %dms', apiDelay)
  greetingRespondsAfter = new Date() + apiDelay
})

app.listen(port, (err) => {
  if (err) {
    throw err
  }

  console.log('listening on port %d', port)
})
