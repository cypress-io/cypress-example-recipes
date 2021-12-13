/// <reference types="Cypress" />

// in this test, there is no backend for the app to hit
// @see https://github.com/cypress-io/cypress/issues/9599
describe('intercept', () => {
  context('stubbed API', () => {
    it('fetches mock users', () => {
      cy.visit('/local-api-example')

      cy.intercept('GET', '/users', {
        fixture: 'users.json',
      }).as('users')

      cy.get('#load-users').click()
      cy.wait('@users')
      cy.get('.user').should('have.length', 2)
    })

    // see https://github.com/cypress-io/cypress/issues/9602
    it('fetches mock users even if the request uses headers', () => {
      cy.visit('/local-api-example')

      cy.intercept('/users', {
        fixture: 'users.json',
      }).as('users')

      cy.get('#load-users-headers').click()
      cy.wait('@users')
      cy.get('.user').should('have.length', 2)
    })
  })
})
