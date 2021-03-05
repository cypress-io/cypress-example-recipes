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

let greetingRespondsAfter = 0

app.post('/reset-api', (req, res) => {
  const apiDelay = Math.round(Math.random() * 4000 + 1000)

  console.log('resetting api, it will respond in %dms', apiDelay)
  greetingRespondsAfter = +new Date() + apiDelay
  res.send('reset')
})

app.get('/greeting', (req, res) => {
  const now = +new Date()

  if (now > greetingRespondsAfter) {
    return res.send('Hello!')
  }

  console.log('greeting API is not ready yet ... ready in %dms', greetingRespondsAfter - now)

  return res.status(404).send('Not ready')
})

app.listen(port, (err) => {
  if (err) {
    throw err
  }

  console.log('listening on port %d', port)
})
