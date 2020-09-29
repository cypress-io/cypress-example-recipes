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

    it('spying on 2nd domain', () => {
      cy.route2('https://jsonplaceholder.cypress.io/users').as('users')
      cy.get('#load-users').click()
      // ⚠️ response is text
      cy.wait('@users').its('response.body')
      .then(JSON.parse).should('have.length', 3)
      .its('0') // grab the first user from the list
      .then((user) => {
        expect(user).to.have.property('id')
        expect(user).to.have.property('username')
        expect(user).to.have.property('email')

        // the user should be shown on the page
        cy.contains('.user', `${user.id} - ${user.email}`).should('be.visible')
      })

      // there should be three users displayed on the page
      cy.get('.user').should('have.length', 3)
    })
  })
})
