/// <reference types="cypress" />
/* eslint-disable mocha/no-global-tests */
it('changes background color', () => {
  // when the app starts, the background is black
  cy.visit('index.html')
  // tip: add additional matchers like "chai-colors"
  // to express desired colors better
  // see recipe "Extending Cypress Chai Assertions"
  cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)')

  // select the new color value in the <input type="color">
  // element and trigger "change" event
  cy.get('input[type=color]')
  .invoke('val', '#ff0000')
  .trigger('change')

  // check the background color has been changed
  cy.get('body').should('have.css', 'background-color', 'rgb(255, 0, 0)')
})

it('can spy on native methods', () => {
  cy.visit('index.html')
  cy.get('body').should('have.css', 'background-color', 'rgb(0, 0, 0)')

  // Cypress has direct access to browser APIs
  // thus we can spy directly on method calls
  cy.document().its('documentElement.style')
  .then((style) => cy.spy(style, 'setProperty').as('setColor'))

  cy.get('input[type=color]')
  .invoke('val', '#ff0000')
  .trigger('change')

  cy.get('body').should('have.css', 'background-color', 'rgb(255, 0, 0)')
  // find spy by its alias and confirm it was called as expected
  cy.get('@setColor').should('have.been.calledWith', '--background-color', '#ff0000')

  // tip: you can use Sinon match placeholders
  // for example, if you don't care precisely about '--background-color'
  // value, but know it should be a string, then use
  cy.get('@setColor').should('have.been.calledWith', Cypress.sinon.match.string, '#ff0000')
})
