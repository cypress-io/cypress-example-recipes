/// <reference types="cypress" />

it('logs in using UI', () => {
  cy.visit('/')
  cy.get('[name=username]').type(Cypress.env('username'))
  cy.get('[name=password]').type(Cypress.env('password'))
  cy.get('[value=login]').click()

  // confirm we have successfully logged in
  cy.location('pathname').should('equal', '/auth')
  cy.get('[data-cy-authenticated]').should('be.visible')

  cy.pause()

  // log out
  cy.get('[value=logout]').click()
  // confirm we have logged out
  cy.location('pathname').should('equal', '/logout')
  cy.get('[data-cy-no-auth]').should('be.visible')
})
