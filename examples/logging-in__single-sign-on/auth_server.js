const url = require('url')
const minimist = require('minimist')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const express = require('express')
const debug = require('debug')('sso')

const app = express()

// get port from passed in args from scripts/start.js
const port = minimist(process.argv.slice(2)).port

const matchesUsernameAndPassword = (body = {}) => {
  debug('checking username "%s" and password "%s', body.username, body.password)

  return body.username === 'jane.lane' && body.password === 'password123'
}

// parse regular form submission bodies
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(morgan('dev'))

app.post('/login', urlencodedParser, (req, res) => {
  debug('in /login')
  // if this matches the secret username and password
  if (matchesUsernameAndPassword(req.body)) {
    debug('username and password match, redirecting to "%s"', req.query.redirectTo)
    // assume we always have this query param property
    const redirectTo = req.query.redirectTo

    // parse the redirectTo invalid a valid URL object
    const outgoing = url.parse(redirectTo)

    // and add these query params to it with an arbitrary
    // id_token (for a simple example)
    outgoing.query = { id_token: 'abc123def456' }

    const format = outgoing.format()

    debug('redirecting to %o', format)

    res.redirect(format)
  } else {
    debug('setting status 401')
    res.sendStatus(401)
  }
})

app.listen(port, () => {

})
