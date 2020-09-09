/// <reference types="Cypress" />

describe('route2', () => {
  context('spying', function () {
    beforeEach(function () {
      cy.route2('/favorite-fruits').as('fetchFruits')
      cy.visit('/')
    })

    it('requests favorite fruits', function () {
      cy.wait('@fetchFruits')
      cy.get('.favorite-fruits li').should('have.length', 5)
    })
  })
})
