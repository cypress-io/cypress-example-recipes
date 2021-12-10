/// <reference types="cypress" />

// This recipe is very similar to the 'Logging In - HTML web form'
// except that is uses AJAX (XHR's) under the hood instead
// of using a regular HTML form submission.
//
// We are going to test a few things:
// 1. Test login form using XHR's
// 2. Test error states
// 3. Stub login XHR with errors and success
// 4. Stub Login.redirect method

// Be sure to run `npm start` to start the server
// before running the tests below.

describe('Logging In - XHR Web Form', function () {
  // normally sensitive information like username and password
  // should be passed via environment variables
  // https://on.cypress.io/env
  const username = 'jane.lane'
  const password = 'password123'

  context('XHR form submission', function () {
    beforeEach(function () {
      cy.visit('/login')
    })

    it('successfully logs in', () => {
      // we can submit form using "cy.submit" command
      // https://on.cypress.io/submit
      cy.get('input[name=username]').type(username)
      cy.get('input[name=password]').type(password)
      cy.get('form').submit()

      // we should be in
      cy.url().should('include', '/dashboard')
      cy.get('h1').should('contain', 'jane.lane')
    })

    it('displays errors on login', function () {
      // we can observe both the UI and the network XHR call
      // during unsuccessful login attempt
      cy.server()

      // alias this route so we can wait on it later
      cy.route('POST', '/login').as('postLogin')

      // incorrect username on password
      cy.get('input[name=username]').type('jane.lae')
      cy.get('input[name=password]').type('password123{enter}')

      // we should always explicitly wait for
      // the response for this POST to come back
      // so our tests are not potentially flaky or brittle
      cy.wait('@postLogin')

      // we should have visible errors now
      cy.get('p.error')
      .should('be.visible')
      .and('contain', 'Username and/or password is incorrect')

      // and still be on the same URL
      cy.url().should('include', '/login')
    })

    it('can stub the XHR to force it to fail', function () {
      // instead of letting this XHR hit our backend we can instead
      // control its behavior programmatically by stubbing it
      cy.server()

      // simulate the server returning 503 with
      // empty JSON response body
      cy.route({
        method: 'POST',
        url: '/login',
        status: 503,
        response: {},
      })
      // alias this route so we can wait on it later
      .as('postLogin')

      // incorrect username on purpose
      cy.get('input[name=username]').type('jane.lae')
      cy.get('input[name=password]').type('password123{enter}')

      // we can even test that the correct request
      // body was sent in this XHR
      cy.wait('@postLogin')
      .its('requestBody')
      .should('deep.eq', {
        username: 'jane.lae',
        password: 'password123',
      })

      // we should have visible errors now
      cy.get('p.error')
      .should('be.visible')
      .and('contain', 'An error occurred: 503 Service Unavailable')

      // and still be on the same URL
      cy.url().should('include', '/login')
    })

    it('redirects to /dashboard on success', function () {
      // we can submit form using "cy.submit" command
      // https://on.cypress.io/submit
      cy.get('input[name=username]').type(username)
      cy.get('input[name=password]').type(password)
      cy.get('form').submit()

      // we should be redirected to /dashboard
      cy.url().should('include', '/dashboard')
      cy.get('h1').should('contain', 'jane.lane')

      // and our cookie should be set to 'cypress-session-cookie'
      cy.getCookie('cypress-session-cookie').should('exist')
    })

    it('redirects on a stubbed XHR', function () {
      // When we stub the XHR we will no longer have a valid
      // cookie which means that on our Login.onSuccess callback
      // when we try to navigate to /dashboard we are unauthorized
      //
      // In this case we can simply stub out the Login.redirect method
      // and test that its called with the right data.
      //
      cy.window()
      .then(function (win) {
        // stub out the Login.redirect method
        // so it doesn't cause the browser to redirect
        cy.stub(win.Login, 'redirect').as('redirect')
      })

      cy.server()

      // simulate the server returning 503 with
      // empty JSON response body
      cy.route({
        method: 'POST',
        url: '/login',
        response: {
          // simulate a redirect to another page
          redirect: '/error',
        },
      })
      // alias this route so we can wait on it later
      .as('postLogin')

      cy.get('input[name=username]').type(username)
      cy.get('input[name=password]').type(password)
      cy.get('form').submit()

      cy.wait('@postLogin')

      // we should not have any visible errors
      cy.get('p.error')
      .should('not.be.visible')
      .then(function () {
        // our redirect function should have been called with
        // the right arguments from the stubbed routed
        expect(this.redirect).to.be.calledWith('/error')
      })
    })
  })
})
