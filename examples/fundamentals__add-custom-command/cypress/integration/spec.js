// @ts-check

// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

/**
 * Adds custom command "cy.dataCy" to the global "cy" object
 *
 * @example cy.dataCy('greeting')
 */
Cypress.Commands.add('dataCy', (value) => cy.get(`[data-cy=${value}]`))

it('finds element using data-cy custom command', () => {
  cy.visit('index.html')
  cy.dataCy('greeting').should('be.visible')
})

it('finds element using h1', () => {
  cy.visit('index.html')
  cy.get('h1')
  .should('be.visible')
  .and('have.attr', 'data-cy', 'greeting')
})
