/* eslint-disable no-console */
const minimist = require('minimist')
const express = require('express')
const morgan = require('morgan')
const o2x = require('object-to-xml')

const app = express()
const port = minimist(process.argv.slice(2)).port

app.use(morgan('dev'))

// a special endpoint for "start-server-and-test" to call
// using HTTP method HEAD. Once it responds, we know the server is ready
app.head('/', (req, res) => {
  res.send('')
})

app.get('/xml-os', (req, res) => {
  const product = {
    '?xml version=\"1.0\" encoding=\"iso-8859-1\"?': null,
    data: {
      '@': {
        type: 'product',
        id: 12344556,
      },
      '#': {
        query: {
          vendor: 'redhat',
          name: 'linux',
        },
      },
    },
  }

  // return the object encoded as XML
  const xml = o2x(product)

  res.set('Content-Type', 'text/xml')
  res.send(xml)
})

app.listen(port)
