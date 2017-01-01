// This recipe expands on the previous 'Logging in' examples
// and shows you how to login when authentication is done
// through a 3rd party server.
//
// There is a web security restriction in Cypress which prevents
// you from visiting two different super domains in the same test
// without setting {chromeWebSecurity: false} in cypress.json.
// However this restriction is easy to bypass (and is much more
// performant and less brittle) with cy.request
//
// There are two servers in use in this example.
// 1. http://localhost:8085 (the app server)
// 2. http://auth.corp.com:8086 (the authentication server)
//
// NOTE: We are able to use auth.corp.com without modifying our
// local /etc/hosts file because cypress supports hosts mapping
// in cypress.json
//
// Pretty much all 3rd party authentication flow works like this:
//
// 1. Visit the 3rd party site (http://auth.corp.com:8086) and tell
//    the 3rd party site where to redirect back to upon success like this:
//    http://auth.corp.com:8086?redirectTo=http://localhost:8085/set_token
//
// 2. Submit the username / password on the auth.corp.com site
//
// 4. Upon success, the 3rd party site redirects back to your application
//    and includes the id_token in the URL like this:
//    http://localhost:8085/set_token?id_token=abc123def456
//
// 5. Your application then parses out the id_token and generally sets it
//    as a cookie or sets it on local storage and includes it on all
//    subsequent requests to your server.
//
// There are other various implementation differences but they are share
// the same fundamental concepts which we can test in Cypress.

// require node's url module
const _   = Cypress._
const url = require('url')

describe('Logging In - Single Sign on', function(){
  Cypress.addParentCommand('loginBySingleSignOn', (overrides = {}) => {
    const options = {
      method: 'POST',
      url: 'http://auth.corp.com:8086/login',
      qs: {
        // use qs to set query string to the url which creates
        // http://auth.corp.com:8080?redirectTo=http://localhost:8085/set_token
        redirectTo: 'http://localhost:8085/set_token'
      },
      form: true, // we are submitting a regular form body
      body: {
        username: 'cypress',
        password: 'password123',
      }
    }

    // allow us to override defaults with passed in overrides
    _.extend(options, overrides)

    cy
      .chain()
      .request(options)
  })

  before(function(){
    // change the baseUrl since we do lots of separate
    // visits and requests in these tests
    Cypress.config('baseUrl', 'http://localhost:8085')
  })

  beforeEach(function(){
    cy.viewport(500, 380)
  })

  context('example #1: use redirectTo and a session cookie', function(){
    // This first example assumes we have an app server that
    // is capable of handling the redirect and sets a session cookie
    //
    // The flow will be:
    // 1. sign into auth.corp.com
    // 2. redirect back to our app server
    // 3. have our app server set a HttpOnly session cookie
    // 4. check that we are now properly logged in

    it('is 403 unauthorized without a session cookie', function(){
      // smoke test just to show that without logging in we cannot
      // visit the dashboard
      cy
        .visit('/dashboard')
        .get('h3').should('contain', 'You are not logged in and cannot access this page')
        .url().should('include', 'unauthorized')
    })

    it('can authenticate with cy.request', function(){
      cy
        // this automatically gets + sets cookies on the browser
        // and follows all of the redirects which ultimately gets
        // us to /dashboard.html
        .loginBySingleSignOn()
        .then((resp) => {
          // yup this should all be good
          expect(resp.status).to.eq(200)

          // we're at http://localhost:8085/dashboard contents
          expect(resp.body).to.include('<h2>dashboard.html</h2>')
        })

        // you don't need to do this next part but
        // just to prove we can also visit the page in our app
        .visit('/dashboard')
        .get('h2').should('contain', 'dashboard.html')

        // and our cookie should be set to 'cypress-session-cookie'
        .getCookie('cypress-session-cookie').should('exist')
    })
  })

  context('example #2: manually parse id_token and set on local storage', function(){
    // This second example assumes we are building a SPA without a server to handle
    // setting the session cookie.
    //
    // The flow will be:
    // 1. disable following automatic redirects
    // 1. sign into auth.corp.com
    // 2. parse out the id_token manually
    // 3. visit our application
    // 4. before it loads, set token on local storage
    // 5. make sure the XHR goes out and the response
    //    is correct + #main has the correct response text

    it('knows when there is no session token', function(){
      // by default our SPA app checks for id_token set in local storage
      // and will display a message if its not set
      //
      // else it will make a XHR to the backend and display the results
      cy
        .visit('/')
        .get('#main')
        .should('contain', 'No session token set!')
    })

    it('can parse out id_token and set on local storage', function(){
      cy
        // dont follow redirects so we can manually parse our
        // the id_token
        .loginBySingleSignOn({followRedirect: false})
        .then((resp) => {
          // we can use the redirectedToUrl property which Cypress adds
          // whenever we turn off following redirects
          //
          // and use node's url.parse module (and parse the query params)
          const uri = url.parse(resp.redirectedToUrl, true)

          // we now have query params as an object and can return
          // the id_token
          return uri.query.id_token
        })
        .then((id_token) => {
          cy
            .server()
            .route('/config').as('getConfig')

            // now go visit our app
            .visit('/', {
              onBeforeLoad: function(win){
                // and before the page finishes loading
                // set the id_token in local storage
                win.localStorage.setItem('id_token', id_token)
              }
            })

            // wait for the /config XHR
            .wait('@getConfig')
              .its('response.body')
              .should('deep.eq', {
                foo: 'bar',
                some: 'config',
                loggedIn: true
              })

            // and now our #main should be filled
            // with the response body
            .get('#main')
              .invoke('text')
              .should((text) => {
                // parse the text into JSON
                const json = JSON.parse(text)

                expect(json).to.deep.eq({
                  foo: 'bar',
                  some: 'config',
                  loggedIn: true
                })
              })
        })
    })
  })

})
