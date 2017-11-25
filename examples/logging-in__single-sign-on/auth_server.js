const url        = require('url')
const minimist   = require('minimist')
const morgan     = require('morgan')
const bodyParser = require('body-parser')
const session    = require('express-session')
const express    = require('express')

const app        = express()

// get port from passed in args from scripts/start.js
const port = minimist(process.argv.slice(2)).port

const matchesUsernameAndPassword = (body = {}) => {
  return body.username === 'jane.lane' && body.password === 'password123'
}

// parse regular form submission bodies
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(morgan("dev"))

app.post('/login', urlencodedParser, (req, res) => {
  // if this matches the secret username and password
  if(matchesUsernameAndPassword(req.body)){
    // assume we always have this query param property
    const redirectTo = req.query.redirectTo

    // parse the redirectTo invalid a valid URL object
    const outgoing = url.parse(redirectTo)

    // and add these query params to it with an arbitrary
    // id_token (for a simple example)
    outgoing.query = { id_token: 'abc123def456'}

    res.redirect(outgoing.format())
  } else {
    res.sendStatus(401)
  }
})

app.listen(port, () => {

})
