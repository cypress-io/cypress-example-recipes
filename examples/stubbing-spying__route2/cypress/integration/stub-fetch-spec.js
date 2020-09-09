/// <reference types="Cypress" />

describe('route2', () => {
  context('stubbing', function () {
    it('shows no Response message', () => {
      // stub server response with []
      cy.route2('/favorite-fruits', JSON.stringify([]))
      cy.visit('/')
      cy.contains('No favorites').should('be.visible')
    })

    it('stubs fetch to test loading indicator', () => {
      cy.route2('/favorite-fruits', (req) => {
        req.reply((res) => {
          res.delay(2000).send(['Pineapple 🍍'])
        })
      })

      cy.visit('/')
      // at first, the app is showing the loading indicator
      cy.get('.loader').should('be.visible')
      // once the promise is resolved, the loading indicator goes away
      cy.get('.loader').should('not.exist')
      cy.contains('li', 'Pineapple 🍍')
    })

    // A big advantage of controlling the response is we can test
    // how our app handles a slow response, which normally might be
    // difficult against a fast development server
    it('shows loader while fetching fruits', function () {
    // stub the XHR request from the app
      cy.route2('/favorite-fruits', (req) => {
        req.reply((res) => {
          // hmm, every time we want to return an empty list
          // we need to stringify it, otherwise the stub does not ... stub
          res.delay(1000).send(JSON.stringify([]))
        })
      })

      cy.visit('/')
      cy.get('.loader').should('be.visible')

      // once the network call finishes, the loader goes away
      cy.get('.loader').should('not.exist')
      cy.contains('.favorite-fruits', 'No favorites')
    })

    it('can spy on network calls from the second page', () => {
      cy.route2('/favorite-fruits').as('favoriteFruits')
      cy.visit('/')
      cy.wait('@favoriteFruits')

      cy.contains('a', 'Go to page 2').click()
      cy.url().should('match', /\/page2\.html$/)
      // the second page also requests the fruits
      cy.wait('@favoriteFruits')
    })

    it('can stub network calls for each page', () => {
      let k = 0

      cy.route2('/favorite-fruits', (req) => {
        k += 1
        switch (k) {
          case 1:
            return req.reply(['apples 🍎'])
          case 2:
            return req.reply(['grapes 🍇'])
          default:
            return req.reply(['kiwi 🥝'])
        }
      })

      cy.visit('/')
      cy.contains('apples 🍎')

      cy.contains('a', 'Go to page 2').click()
      cy.url().should('match', /\/page2\.html$/)
      cy.contains('grapes 🍇')

      cy.contains('a', 'Go back').click()
      cy.contains('kiwi 🥝')
    })

    describe('when favorite fruits are returned', function () {
      it('displays the list of fruits', function () {
        // aliasing allows us to easily get access to our stub
        cy.route2('/favorite-fruits', ['Apple', 'Banana', 'Cantaloupe']).as('fetchFavorites')
        cy.visit('/')
        cy.wait('@fetchFavorites')

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
      it('displays empty message', function () {
        cy.route2('/favorite-fruits', JSON.stringify([]))
        cy.visit('/')
        cy.get('.favorite-fruits').should('have.text', 'No favorites')
      })
    })

    describe('when request fails', function () {
      it('displays error', function () {
        cy.route2('/favorite-fruits', (req) => {
          req.reply({
            statusCode: 500,
            body: '',
            headers: {
              'status-text': 'Orchard under maintenance',
            },
          })
        })

        cy.visit('/')

        cy.get('.favorite-fruits')
        .should('have.text', 'Failed loading favorite fruits: Orchard under maintenance')
      })
    })
  })
})
