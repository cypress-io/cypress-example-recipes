/// <reference types="Cypress" />

// Here, we completely stub out window.fetch, allowing
// us to more finely control the server responses
//
// This allows us to test various data responses like errors
const deferred = require('./deferred')

describe('stubbing', function () {
  beforeEach(function () {
    // We use a deferred object to make it easy to test
    // different scenarios
    this.fetchFavoritesDeferred = deferred()

    // We use cy.visit({onBeforeLoad: ...}) to stub
    // window.fetch before any app code runs
    cy.visit('/', {
      onBeforeLoad (win) {
        cy.stub(win, 'fetch')
        .withArgs('/favorite-fruits')
        .as('fetchFavorites')
        .returns(this.fetchFavoritesDeferred.promise)
      },
    })
  })

  it('requests favorite fruits', function () {
    // aliasing allows us to easily get access to our stub
    cy.get('@fetchFavorites').should('be.calledWith', '/favorite-fruits')
  })

  // A big advantage of controlling the response is we can test
  // how our app handles a slow response, which normally might be
  // difficult against a fast development server
  it('shows loader while fetching fruits', function () {
    cy.get('.loader')
  })

  describe('when favorite fruits are returned', function () {
    beforeEach(function () {
      this.fetchFavoritesDeferred.resolve({
        json () { return ['Apple', 'Banana', 'Cantaloupe'] },
        ok: true,
      })
    })

    it('displays the list of fruits', function () {
      cy.get('.favorite-fruits li').as('favoriteFruits')
      .should('have.length', 3)

      cy.get('@favoriteFruits').first()
      .should('have.text', 'Apple')
      cy.get('@favoriteFruits').eq(1)
      .should('have.text', 'Banana')
      cy.get('@favoriteFruits').eq(2)
      .should('have.text', 'Cantaloupe')
    })
  })

  describe('when no favorite fruits are returned', function () {
    beforeEach(function () {
      this.fetchFavoritesDeferred.resolve({
        json () { return [] },
        ok: true,
      })
    })

    it('displays empty message', function () {
      cy.get('.favorite-fruits').should('have.text', 'No favorites')
    })
  })

  describe('when request fails', function () {
    beforeEach(function () {
      this.fetchFavoritesDeferred.resolve({
        ok: false,
        statusText: 'Orchard under maintenance',
      })
    })

    it('displays error', function () {
      cy.get('.favorite-fruits')
      .should('have.text', 'Failed loading favorite fruits: Orchard under maintenance')
    })
  })
})
