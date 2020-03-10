/// <reference types="cypress" />
/* eslint-disable mocha/no-global-tests */
it('changes background color', () => {
  cy.visit('index.html')
  cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)')

  cy.get('input[type=color]')
  .invoke('val', '#ff0000')
  .trigger('change')

  cy.get('body').should('have.css', 'background-color', 'rgb(255, 0, 0)')
})

it('can spy on native methods', () => {
  cy.visit('index.html')
  cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)')

  cy.document().its('documentElement.style')
  .then((style) => cy.spy(style, 'setProperty').as('setColor'))

  cy.get('input[type=color]')
  .invoke('val', '#ff0000')
  .trigger('change')

  cy.get('body').should('have.css', 'background-color', 'rgb(255, 0, 0)')
  cy.get('@setColor').should('have.been.calledWith', '--background-color', '#ff0000')
})
