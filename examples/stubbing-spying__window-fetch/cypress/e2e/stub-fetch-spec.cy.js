/// <reference types="Cypress" />
// @ts-check

describe('stubbing', function () {
  it('shows no Response message', () => {
    cy.visit('/', {
      onBeforeLoad (win) {
        cy.stub(win, 'fetch').withArgs('/favorite-fruits')
        .resolves({
          ok: true,
          json: () => [],
        })
      },
    })

    cy.contains('No favorites').should('be.visible')
  })

  it('directly stubs window.fetch to test loading indicator', () => {
    // stub the "fetch(/favorite-fruits)" call from the app
    cy.visit('/', {
      onBeforeLoad (win) {
        cy.stub(win, 'fetch').withArgs('/favorite-fruits')
        .resolves(
          // use Bluebird promise bundled with Cypress
          // to resolve after 2000ms
          Cypress.Promise.resolve({
            ok: true,
            json: () => ['Pineapple 🍍'],
          }).delay(2000)
        )
      },
    })

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
    cy.server()
    cy.route({
      url: '/favorite-fruits',
      response: [],
      delay: 1000,
    })

    cy.visit('/')
    cy.get('.loader').should('be.visible')

    // once the network call finishes, the loader goes away
    cy.get('.loader').should('not.exist')
    cy.contains('.favorite-fruits', 'No favorites')
  })

  it('can spy on network calls from the second page', () => {
    cy.server()
    cy.route('/favorite-fruits').as('favoriteFruits')
    cy.visit('/')
    cy.wait('@favoriteFruits')

    cy.contains('a', 'Go to page 2').click()
    cy.url().should('match', /\/page2\.html$/)
    // the second page also requests the fruits
    cy.wait('@favoriteFruits')
  })

  it('can stub network calls for each page', () => {
    cy.server()
    cy.route('/favorite-fruits', ['apples 🍎'])
    cy.visit('/')
    cy.contains('apples 🍎')

    // change the response before going to the second page
    cy.route('/favorite-fruits', ['grapes 🍇'])
    cy.contains('a', 'Go to page 2').click()
    cy.url().should('match', /\/page2\.html$/)
    cy.contains('grapes 🍇')

    // change the response before going back to the index page
    cy.route('/favorite-fruits', ['kiwi 🥝'])
    cy.contains('a', 'Go back').click()
    cy.contains('kiwi 🥝')
  })

  describe('when favorite fruits are returned', function () {
    it('displays the list of fruits', function () {
      cy.server()
      // aliasing allows us to easily get access to our stub
      cy.route('/favorite-fruits', ['Apple', 'Banana', 'Cantaloupe']).as('fetchFavorites')
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
      cy.server()
      cy.route('/favorite-fruits', [])
      cy.visit('/')
      cy.get('.favorite-fruits').should('have.text', 'No favorites')
    })
  })

  describe('when request fails', function () {
    it('displays error', function () {
      cy.server()
      cy.route({
        url: '/favorite-fruits',
        status: 500,
        response: '',
        delay: 2000,
        headers: {
          'status-text': 'Orchard under maintenance',
        },
      })

      cy.visit('/')

      cy.get('.favorite-fruits')
      .should('have.text', 'Failed loading favorite fruits: Orchard under maintenance')
    })
  })
})
