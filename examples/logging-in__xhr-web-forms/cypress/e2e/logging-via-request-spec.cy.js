/// <reference types="cypress" />

describe('Logging in using XHR request', function () {
  const username = 'jane.lane'
  const password = 'password123'

  it('can bypass the UI and yet still log in', function () {
    // oftentimes once we have a proper e2e test around logging in
    // there is NO more reason to actually use our UI to log in users
    // doing so wastes a huge amount of time, as our entire page has to load
    // all associated resources have to load, we have to wait to fill the
    // form and for the form submission and redirection process
    //
    // with cy.request we can bypass all of this because it automatically gets
    // and sets cookies under the hood which acts exactly as if these requests
    // came from the browser
    cy.request({
      method: 'POST',
      url: '/login', // baseUrl will be prepended to this url
      body: {
        username,
        password,
      },
    })

    // just to prove we have a session
    cy.getCookie('cypress-session-cookie').should('exist')

    // which means we can visit the page behind the authentication
    // and it loads successfully
    cy.visit('/dashboard')
    cy.contains('h1', 'jane.lane')
  })
})
