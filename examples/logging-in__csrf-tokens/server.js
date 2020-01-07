const csurf = require('csurf')
const morgan = require('morgan')
const minimist = require('minimist')
const bodyParser = require('body-parser')
const session = require('express-session')
const express = require('express')

const app = express()

// get port from passed in args from scripts/start.js
const port = minimist(process.argv.slice(2)).port

const csrfProtection = csurf()

const matchesUsernameAndPassword = (body = {}) => {
  return body.username === 'cypress' && body.password === 'password123'
}

const ensureLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/unauthorized')
  }
}

// parse regular form submission bodies
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(morgan('dev'))

// store a session cookie called
// 'cypress-session-cookie'
app.use(session({
  name: 'cypress-session-cookie',
  secret: 'sekret',
  resave: false,
  saveUninitialized: false,
}))

// app.use((req, res, next) => {
//   console.log('session info is', req.session)
//   next()
// })

app.set('views', __dirname)
app.set('view engine', 'hbs')

app.get('/', (req, res) => res.redirect('/login'))

// this is the standard HTML login page
app.get('/login', csrfProtection, (req, res) => {
  const token = req.csrfToken()

  res
  .set('x-csrf-token', token) // set a response header
  .render('./login.hbs', {
    csrfToken: token, // and also send this part of the HTML
  })
})

// specify that the urlencodedParser should only
// be used on this one route when its coming from
// the login form
app.post('/login', urlencodedParser, csrfProtection, (req, res) => {
  // if this matches the secret username and password
  if (matchesUsernameAndPassword(req.body)) {
    req.session.user = 'cypress'

    res.redirect('/dashboard')
  } else {
    // render login with errors
    res.render('./login.hbs', {
      error: 'Username and password incorrect',
    })
  }
})

app.get('/dashboard', ensureLoggedIn, (req, res) => {
  res.render('./dashboard.hbs')
})

// if we are not in production expose a simple
// GET /csrf route to hand us back the token over JSON
if (process.env.NODE_ENV !== 'production') {
  app.get('/csrf', csrfProtection, (req, res) => {
    res.json({
      csrfToken: req.csrfToken(),
    })
  })
}

app.use((err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).render('./csrf.hbs')
  }

  next(err)
})

app.listen(port)
