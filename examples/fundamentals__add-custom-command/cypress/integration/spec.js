// @ts-check

// load the type definition for new command we are adding "cy.dataCy"
// note: this definition also will load regular Cypress definition
// because index.d.ts references global "cypress" types
/// <reference path="../support/index.d.ts" />

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
