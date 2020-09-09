/// <reference types="Cypress" />

describe('route2', () => {
  context('spying', function () {
    beforeEach(function () {
      cy.route2('/favorite-fruits').as('fetchFruits')
      cy.visit('/')
    })

    it('requests favorite fruits', function () {
      cy.wait('@fetchFruits')
      // TODO: can we inspect the response object from the server?
      // like response body...
      // https://github.com/cypress-io/cypress/issues/8536
      cy.get('.favorite-fruits li').should('have.length', 5)
    })
  })
})
