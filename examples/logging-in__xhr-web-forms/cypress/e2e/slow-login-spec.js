/// <reference types="cypress" />

describe('Logging in when XHR is slow', function () {
  const username = 'jane.lane'
  const password = 'password123'

  const sessionCookieName = 'cypress-session-cookie'

  // the XHR endpoint /slow-login takes a couple of seconds
  // we so don't want to login before each test
  // instead we want to get the session cookie just ONCE before the tests
  before(function () {
    cy.request({
      method: 'POST',
      url: '/slow-login',
      body: {
        username,
        password,
      },
    })

    // cy.getCookie automatically waits for the previous
    // command cy.request to finish
    // we ensure we have a valid cookie value and
    // save it in the test context object "this.sessionCookie"
    // that's why we use "function () { ... }" callback form
    cy.getCookie(sessionCookieName)
    .should('exist')
    .its('value')
    .should('be.a', 'string')
    .as('sessionCookie')
  })

  beforeEach(function () {
    // before each test we just set the cookie value
    // making the login instant. Since we want to access
    // the test context "this.sessionCookie" property
    // we need to use "function () { ... }" callback form
    cy.setCookie(sessionCookieName, this.sessionCookie)
  })

  it('loads the dashboard as an authenticated user', function () {
    cy.visit('/dashboard')
    cy.contains('h1', 'jane.lane')
  })

  it('loads the admin view as an authenticated user', function () {
    cy.visit('/admin')
    cy.contains('h1', 'Admin')
  })
})
