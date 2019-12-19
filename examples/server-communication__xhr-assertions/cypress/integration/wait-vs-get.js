/// <reference types="cypress" />
// failing test is skipped
it.skip('cy.get yields null if the network request has not happened yet', () => {
  cy.visit('index.html')

  cy.server()
  cy.route('POST', '/posts').as('post')

  cy.get('#delayed-load').click()
  // cy.get does NOT work
  // because it immediately returns null object,
  // since the request has not happened yet
  cy.get('@post').should('have.property', 'status', 201)
})


it('cy.wait waits for the network request to happen', () => {
  cy.visit('index.html')

  cy.server()
  cy.route('POST', '/posts').as('post')

  cy.get('#delayed-load').click()
  cy.wait('@post').should('have.property', 'status', 201)
})
