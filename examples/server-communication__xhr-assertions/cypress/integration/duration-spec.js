/// <reference types="cypress" />
describe('XHR', () => {
  it('is faster than 600ms', { retries: 3 }, () => {
    cy.visit('index.html')

    // before the request goes out we need to set up spying
    // see https://on.cypress.io/network-requests
    cy.server()
    cy.route('POST', '/posts').as('post')

    cy.get('#load').click()
    cy.wait('@post').its('duration').should('be.lessThan', 600)
  })
})
