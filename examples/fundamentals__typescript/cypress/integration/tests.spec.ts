/// <reference types="Cypress" />

it('test custom command', () => {
  cy.visit('https://cypress.io')
  cy.clickLink('get started')
})
