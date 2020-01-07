const minimist = require('minimist')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const express = require('express')

const app = express()

// get port from passed in args from scripts/start.js
const port = minimist(process.argv.slice(2)).port

const matchesUsernameAndPassword = (body = {}) => {
  return body.username === 'jane.lane' && body.password === 'password123'
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
app.get('/login', (req, res) => {
  res.render('./login.hbs')
})

// specify that the urlencodedParser should only
// be used on this one route when its coming from
// the login form
app.post('/login', urlencodedParser, (req, res) => {
  // if this matches the secret username and password
  if (matchesUsernameAndPassword(req.body)) {
    req.session.user = 'jane.lane'

    res.redirect('/dashboard')
  } else {
    // render login with errors
    res.render('./login.hbs', {
      error: 'Username and/or password is incorrect',
    })
  }
})

app.get('/dashboard', ensureLoggedIn, (req, res) => {
  res.render('./dashboard.hbs', {
    user: req.session.user,
  })
})

app.get('/users', ensureLoggedIn, (req, res) => {
  res.render('./users.hbs')
})

app.get('/admin', ensureLoggedIn, (req, res) => {
  res.render('./admin.hbs')
})

app.get('/unauthorized', (req, res) => {
  res.render('./unauthorized.hbs')
})

app.listen(port)
