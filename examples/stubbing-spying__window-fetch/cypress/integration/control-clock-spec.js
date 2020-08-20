/// <reference types="Cypress" />

// This app we are testing shows a random list of
// "favorite fruits" that refreshes every 30 seconds

// The favorite fruits are refreshed every 30 seconds
// It would slow down our tests dramatically to literally
// wait that long to verify the behavior.
//
// We can use Cypress's clock and tick commands to speed it up.
//
// Since the list of fruits returned from the API are random,
// using the real server would lead to flaky tests, so we
// stub out window.fetch again in order to control the response
describe('clock', function () {
  describe('when favorite fruits are returned', function () {
    it('displays list of fruits', function () {
      cy.server()
      // aliasing allows us to easily get access to our stub
      cy.route('/favorite-fruits', ['Apple', 'Banana', 'Cantaloupe'])
      cy.visit('/')

      cy.get('.favorite-fruits li').as('favoriteFruits')
      .should('have.length', 3)

      cy.get('@favoriteFruits').first()
      .should('have.text', 'Apple')

      cy.get('@favoriteFruits').eq(1)
      .should('have.text', 'Banana')

      cy.get('@favoriteFruits').eq(2)
      .should('have.text', 'Cantaloupe')
    })

    describe('polling every 30 secs', function () {
      it('displays the new list of fruits', () => {
        cy.clock()
        cy.server()
        // aliasing allows us to easily get access to our stub
        cy.route('/favorite-fruits', ['Apple', 'Banana', 'Cantaloupe'])
        cy.visit('/')

        // initial list of fruits is shown
        cy.get('.favorite-fruits li').should('have.length', 3)

        // now prepare for the second call
        cy.route('/favorite-fruits', ['Orange', 'Cherry', 'Raspberry', 'Pineapple'])
        // move time 30 seconds and the setInterval will be triggered
        // that polls for the fruit
        cy.tick(30000)

        // make sure the updated list is shown
        cy.get('.favorite-fruits li').as('favoriteFruits')
        .should('have.length', 4)

        cy.get('@favoriteFruits').first()
        .should('have.text', 'Orange')

        cy.get('@favoriteFruits').eq(1)
        .should('have.text', 'Cherry')

        cy.get('@favoriteFruits').eq(2)
        .should('have.text', 'Raspberry')

        cy.get('@favoriteFruits').eq(3)
        .should('have.text', 'Pineapple')
      })
    })
  })
})
