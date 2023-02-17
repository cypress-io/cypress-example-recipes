/// <reference types="cypress" />

// This recipe expands on the previous 'Logging in' examples
// and shows you how to use cy.request when your backend
// validates POSTs against a CSRF token
//
describe('Logging In - CSRF Tokens', function () {
  const username = 'cypress'
  const password = 'password123'

  Cypress.Commands.add('loginByCSRF', (csrfToken) => {
    cy.request({
      method: 'POST',
      url: '/login',
      failOnStatusCode: false, // dont fail so we can make assertions
      form: true, // we are submitting a regular form body
      body: {
        username,
        password,
        _csrf: csrfToken, // insert this as part of form body
      },
    })
  })

  /**
   * A utility function to check that we are seeing the dashboard page
   */
  const inDashboard = () => {
    cy.location('href').should('match', /dashboard$/)
    cy.contains('h2', 'dashboard.html')
  }

  /**
   * A utility function to confirm we can visit a protected page
   */
  const visitDashboard = () => {
    cy.visit('/dashboard')
    inDashboard()
  }

  beforeEach(function () {
    cy.viewport(500, 380)
  })

  it('redirects to /login', () => {
    cy.visit('/')
    cy.location('href').should('match', /login$/)
  })

  it('403 status without a valid CSRF token', function () {
    // first show that by not providing a valid CSRF token
    // that we will get a 403 status code
    cy.loginByCSRF('invalid-token')
    .its('status')
    .should('eq', 403)
  })

  it('strategy #1: parse token from HTML', function () {
    // if we cannot change our server code to make it easier
    // to parse out the CSRF token, we can simply use cy.request
    // to fetch the login page, and then parse the HTML contents
    // to find the CSRF token embedded in the page
    cy.request('/login')
    .its('body')
    .then((body) => {
      // we can use Cypress.$ to parse the string body
      // thus enabling us to query into it easily
      const $html = Cypress.$(body)
      const csrf = $html.find('input[name=_csrf]').val()

      cy.loginByCSRF(csrf)
      .then((resp) => {
        expect(resp.status).to.eq(200)
        expect(resp.body).to.include('<h2>dashboard.html</h2>')
      })
    })

    // successful "cy.request" sets all returned cookies, thus we should
    // be able to visit the protected page - we are logged in!
    visitDashboard()
  })

  it('strategy #2: parse token from response headers', function () {
    // if we embed our csrf-token in response headers
    // it makes it much easier for us to pluck it out
    // without having to dig into the resulting HTML
    cy.request('/login')
    .its('headers')
    .then((headers) => {
      const csrf = headers['x-csrf-token']

      cy.loginByCSRF(csrf)
      .then((resp) => {
        expect(resp.status).to.eq(200)
        expect(resp.body).to.include('<h2>dashboard.html</h2>')
      })
    })

    visitDashboard()
  })

  it('strategy #3: expose CSRF via a route when not in production', function () {
    // since we are not running in production we have exposed
    // a simple /csrf route which returns us the token directly
    // as json
    cy.request('/csrf')
    .its('body.csrfToken')
    .then((csrf) => {
      cy.loginByCSRF(csrf)
      .then((resp) => {
        expect(resp.status).to.eq(200)
        expect(resp.body).to.include('<h2>dashboard.html</h2>')
      })
    })

    visitDashboard()
  })

  it('strategy #4: slow login via UI', () => {
    // Not recommended: log into the application like a user
    // by typing into the form and clicking Submit
    // While this works, it is slow and exercises the login form
    // and NOT the feature you are trying to test.
    cy.visit('/login')
    cy.get('input[name=username]').type(username)
    cy.get('input[name=password]').type(password)
    cy.get('form').submit()
    inDashboard()
  })
})
