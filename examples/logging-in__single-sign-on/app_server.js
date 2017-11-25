const path       = require('path')
const minimist   = require('minimist')
const morgan     = require('morgan')
const session    = require('express-session')
const express    = require('express')

const app        = express()

// get port from passed in args from scripts/start.js
const port = minimist(process.argv.slice(2)).port

const ensureLoggedIn = (req, res, next) => {
  // if we have any id_token in our session
  // or we have it in a x-session-token header
  //
  // NOTE: typically you'd use an Authorization bearer header
  // but for simplicitiy we're setting x-session-token
  if (req.session.id_token || req.get('x-session-token')) {
    next()
  } else {
    res.redirect('/unauthorized')
  }
}

app.use('/node_modules', express.static(path.join(__dirname, '..', '..', 'node_modules')))
app.use(morgan("dev"))

// store a session cookie called
// 'cypress-session-cookie'
app.use(session({
  name: 'cypress-session-cookie',
  secret: 'sekret',
  resave: false,
  saveUninitialized: false
}))

// app.use((req, res, next) => {
//   console.log('session info is', req.session)
//   next()
// })

app.set('views', __dirname)
app.set('view engine', 'hbs')

// this is the url that is the 'redirectTo'
// after we log into our external auth server
app.get('/set_token', (req, res) => {
  // set the session id_token to whatever
  // is set in the query params of the URL
  req.session.id_token = req.query.id_token

  res.redirect('/dashboard')
})

app.get('/dashboard', ensureLoggedIn, (req, res) => {
  res.render('./dashboard.hbs')
})

app.get('/config', ensureLoggedIn, (req, res) => {
  res.json({
    foo: 'bar',
    some: 'config',
    loggedIn: true
  })
})

app.get('/unauthorized', (req, res) => {
  res.render('./unauthorized.hbs')
})

app.get('/', (req, res) => {
  res.render("./index.hbs")
})

app.listen(port, () => {

})
