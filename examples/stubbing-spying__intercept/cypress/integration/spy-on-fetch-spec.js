/// <reference types="Cypress" />

describe('get vs GET', () => {
  context('cy.route', () => {
    let polyfill

    // grab fetch polyfill from remote URL, could be also from a local package
    before(() => {
      const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js'

      cy.request(polyfillUrl)
      .then((response) => {
        polyfill = response.body
      })
    })

    it('works with GET', function () {
      cy.server()
      cy.route('get', '/favorite-fruits').as('fruits')
      cy.visit('/', {
        onBeforeLoad (win) {
          delete win.fetch
          win.eval(polyfill)
          win.fetch = win.unfetch
        },
      })

      cy.wait('@fruits')
    })

    it('works with get', function () {
      cy.server()
      cy.route('get', '/favorite-fruits').as('fruits')
      cy.visit('/', {
        onBeforeLoad (win) {
          delete win.fetch
          win.eval(polyfill)
          win.fetch = win.unfetch
        },
      })

      cy.wait('@fruits')
    })
  })

  context('cy.intercept', () => {
    it('works with GET', function () {
      cy.intercept('GET', '/favorite-fruits').as('fruits')
      cy.visit('/')

      cy.wait('@fruits')
    })

    // NOTE: does NOT work with "get"
    it.skip('works with get', function () {
      cy.intercept('get', '/favorite-fruits').as('fruits')
      cy.visit('/')

      cy.wait('@fruits')
    })
  })
})

describe('intercept', () => {
  context('spying', function () {
    beforeEach(function () {
      cy.intercept('/favorite-fruits').as('fetchFruits')
      cy.visit('/')
    })

    it('requests favorite fruits', function () {
      cy.wait('@fetchFruits').its('response.body')
      .then((fruits) => {
        cy.get('.favorite-fruits li').should('have.length', fruits.length)

        fruits.forEach((fruit) => {
          cy.contains('.favorite-fruits li', fruit)
        })
      })
    })

    it('spying on 2nd domain', () => {
      cy.intercept('https://jsonplaceholder.cypress.io/users').as('users')
      cy.get('#load-users').click()
      cy.wait('@users').its('response.body').should('have.length', 3)
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
