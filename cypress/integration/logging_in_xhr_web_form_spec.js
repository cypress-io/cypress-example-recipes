// This recipe is very similar to the 'Logging In - HTML web form'
// except that is uses AJAX (XHR's) under the hood instead
// of using a regular HTML form submission.
//
// We are going to test a few things:
// 1. Test login form using XHR's
// 2. Test error states
// 3. Stub login XHR with errors and success
// 4. Stub Login.redirect method
// 5. Use cy.request for much faster performance
// 6. Create a custom command

// Be sure to run `npm start` to start the server
// before running the tests below.

describe('Logging In - XHR Web Form', function(){
  before(function(){
    // change the baseUrl since we do lots of separate
    // visits and requests in these tests
    Cypress.config('baseUrl', 'http://localhost:8083')
  })

  context('XHR form submission', function(){
    beforeEach(function(){
      cy.visit('/login')
    })

    it('displays errors on login', function(){
      cy
        .server()

        // alias this route so we can wait on it later
        .route('POST', '/login').as('postLogin')

        .get('input[name=username]').type('jane.lae')
        .get('input[name=password]').type('password123{enter}')

        // we should always explictly wait for
        // the response for this POST to come back
        // so our tests are not potentially flaky or brittle
        .wait('@postLogin')

        // we should have visible errors now
        .get('p.error')
          .should('be.visible')
          .and('contain', 'Username and/or password is incorrect')

        // and still be on the same URL
        .url().should('include', '/login')
    })

    it('can stub the XHR to force it to fail', function(){
      // instead of letting this XHR hit our backend we can instead
      // control its behavior programatically by stubbing it
      cy
        .server()

        // simulate the server returning 503 with
        // empty JSON response body
        .route({
          method: 'POST',
          url: '/login',
          status: 503,
          response: {}
        })
        // alias this route so we can wait on it later
        .as('postLogin')

        .get('input[name=username]').type('jane.lae')
        .get('input[name=password]').type('password123{enter}')

        // we can even test that the correct request
        // body was sent in this XHR
        .wait('@postLogin')
          .its('requestBody')
          .should('deep.eq', {
            username: 'jane.lae',
            password: 'password123'
          })

        // we should have visible errors now
        .get('p.error')
          .should('be.visible')
          .and('contain', 'An error occurred: 503 Service Unavailable')

        // and still be on the same URL
        .url().should('include', '/login')
    })

    it('redirects to /dashboard on success', function(){
      cy
        .get('input[name=username]').type('jane.lane')
        .get('input[name=password]').type('password123{enter}')

        // we should be redirected to /dashboard
        .url().should('include', '/dashboard')
        .get('h1').should('contain', 'jane.lane')

        // and our cookie should be set to 'cypress-session-cookie'
        .getCookie('cypress-session-cookie').should('exist')
    })

    it('redirects on a stubbed XHR', function(){
      // When we stub the XHR we will no longer have a valid
      // cookie which means that on our Login.onSuccess callback
      // when we try to navigate to /dashboard we are unauthorized
      //
      // In this case we can simply stub out the Login.redirect method
      // and test that its called with the right data.
      //
      cy
        .visit('/login')
        .window()
        .then(function(win){
          // stub out the Login.redirect method
          // so it doesnt cause the browser to redirect
          cy.stub(win.Login, 'redirect').as("redirect")
        })
        .server()

        // simulate the server returning 503 with
        // empty JSON response body
        .route({
          method: 'POST',
          url: '/login',
          response: {
            // simulate a redirect to another page
            redirect: '/error'
          }
        })
        // alias this route so we can wait on it later
        .as('postLogin')

        .get('input[name=username]').type('jane.lane')
        .get('input[name=password]').type('password123{enter}')

        .wait('@postLogin')

        // we should not have any visible errors
        .get('p.error')
          .should('not.be.visible')

        .then(function(){
          // our redirect function should have been called with
          // the right arguments from the stubbed routed
          expect(this.redirect).to.be.calledWith('/error')
        })
    })
  })

  context('XHR form submission with cy.request', function(){
    it('can bypass the UI and yet still log in', function(){
      // oftentimes once we have a proper e2e test around logging in
      // there is NO more reason to actually use our UI to log in users
      // doing so wastes a huge amount of time, as our entire page has to load
      // all associated resources have to load, we have to wait to fill the
      // form and for the form submission and redirection process
      //
      // with cy.request we can bypass all of this because it automatically gets
      // and sets cookies under the hood which acts exactly as if these requests
      // came from the browser
      cy
        .request({
          method: 'POST',
          url: '/login', // baseUrl will be prepended to this url
          body: {
            username: 'jane.lane',
            password: 'password123'
          }
        })

        // just to prove we have a session
        cy.getCookie('cypress-session-cookie').should('exist')
    })
  })

  context('Reusable "login" custom command', function(){
    // typically we'd put this in cypress/support/commands.js
    // but because this custom command is specific to this example
    // we'll keep it here
    Cypress.addParentCommand('loginByJSON', (username, password) => {

      Cypress.Log.command({
        name: 'loginByJSON',
        message: username + ' | ' + password
      })

      return cy.request({
        method: 'POST',
        url: '/login',
        body: {
          username: username,
          password: password
        }
      })
    })

    beforeEach(function(){
      // login before each test
      cy.loginByJSON('jane.lane', 'password123')
    })

    it('can visit /dashboard', function(){
      cy
        .visit('/dashboard')
        .get('h1').should('contain', 'jane.lane')
    })

    it('can visit /users', function(){
      cy
        .visit('/users')
        .get('h1').should('contain', 'Users')
    })

    it('can simply request other authenticated pages', function(){
      cy
        // instead of visiting each page and waiting for all
        // the associated resources to load, we can instead
        // just issue a simple HTTP request and make an
        // assertion about the response body
        .request('/admin')
        .its('body')
        .should('include', '<h1>Admin</h1>')
    })
  })
})
