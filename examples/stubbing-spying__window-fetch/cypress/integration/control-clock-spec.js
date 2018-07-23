/// <reference types="Cypress" />

// This app we are testing shows a random list of
// "favorite fruits" that refreshes every 30 seconds

const deferred = require('./deferred')

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
  beforeEach(function () {
    this.fetchFavoritesDeferred = deferred()

    cy.clock()
    cy.visit('/', {
      onBeforeLoad (win) {
        cy.stub(win, 'fetch')
        .withArgs('/favorite-fruits')
        .as('fetchFavorites')
        .returns(this.fetchFavoritesDeferred.promise)
      },
    })
  })

  describe('when favorite fruits are returned', function () {
    beforeEach(function () {
      this.fetchFavoritesDeferred.resolve({
        json () { return ['Apple', 'Banana', 'Cantaloupe'] },
        ok: true,
      })
    })

    it('displays list of fruits', function () {
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
      beforeEach(function () {
        // since we aliased the window.fetch stub to 'fetchFavorites',
        // it becomes available as this.fetchFavorites in our tests
        this.fetchFavorites.onCall(1).resolves({
          json () { return ['Orange', 'Cherry', 'Raspberry', 'Pineapple'] },
          ok: true,
        })
        // move time 30 seconds and the setInterval will be triggered
        // that polls for the fruit
        cy.tick(30000)
      })

      it('fetches fruit again', function () {
        expect(this.fetchFavorites).to.be.calledTwice
      })

      it('displays the new list of fruits', function () {
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
