/// <reference types="cypress" />

// see https://on.cypress.io/custom-commands
//
// typically we'd put this in cypress/support/commands.js
// but because this custom command is specific to this example
// we'll keep it here
Cypress.Commands.add('loginByJSON', (username, password) => {
  Cypress.log({
    name: 'login by JSON',
    message: `${username} | ${password}`,
  })

  return cy.request({
    method: 'POST',
    url: '/login',
    body: {
      username,
      password,
    },
  })
})

context('Reusable "login" custom command', function () {
  const username = 'jane.lane'
  const password = 'password123'

  beforeEach(function () {
    // login before each test
    cy.loginByJSON(username, password)
  })

  it('can visit /dashboard', function () {
    cy.visit('/dashboard')
    cy.get('h1').should('contain', 'jane.lane')
  })

  it('can visit /users', function () {
    cy.visit('/users')
    cy.get('h1').should('contain', 'Users')
  })

  it('can simply request other authenticated pages', function () {
    // instead of visiting each page and waiting for all
    // the associated resources to load, we can instead
    // just issue a simple HTTP request and make an
    // assertion about the response body
    cy.request('/admin')
    .its('body')
    .should('include', '<h1>Admin</h1>')
  })

  it('can visit other authenticated pages', function () {
    cy.visit('/admin')
    cy.contains('h1', 'Admin')
  })
})
