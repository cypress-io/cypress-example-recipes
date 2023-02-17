/// <reference types="cypress" />
describe('clock', () => {
  it('speeds up application by controlling clock', () => {
  // before loading application start mocking the app's clock
  // https://on.cypress.io/clock
    cy.clock()
    cy.visit('index.html')

    // before the request goes out we need to set up spying
    // see https://on.cypress.io/network-requests
    cy.intercept('POST', '/posts').as('post')

    cy.get('#delayed-load').click()
    // force the application to pass 1 second really quickly
    // https://on.cypress.io/tick
    cy.tick(1001)
    cy.wait('@post').its('response').should('have.property', 'statusCode', 201)
  })
})
