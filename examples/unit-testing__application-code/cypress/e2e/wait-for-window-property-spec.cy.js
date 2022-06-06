/// <reference types="cypress" />

context('waiting for a property of an object', () => {
  it('waits for a variable to be set on application\'s Window object', () => {
    cy.visit('./index.html')
    // similar to above examples, cy.window() yields application's Window
    // object and we tell Cypress to retry until that object has property "AppReady"
    // and its value is `true`.
    cy.window().should('have.property', 'AppReady', true)
  })
})
