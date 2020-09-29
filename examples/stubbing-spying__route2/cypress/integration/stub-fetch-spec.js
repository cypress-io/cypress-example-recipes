/// <reference types="Cypress" />
/* eslint-disable no-console */
describe('route2', () => {
  context('stubbing', function () {
    it('shows no Response message', () => {
      // stub server response with []
      // for now have to stringify empty arrays
      // https://github.com/cypress-io/cypress/issues/8532
      cy.route2('/favorite-fruits', [])
      cy.visit('/')
      cy.contains('No favorites').should('be.visible')
    })

    it('modifies the response from the server to insert Kiwi', () => {
      cy.route2('favorite-fruits', (req) => {
        req.reply((res) => {
          // add Kiwi to the list received from the server
          console.log('original response from the server is %s %o', typeof res.body, res.body)
          const list = JSON.parse(res.body)

          list.push('Kiwi')
          res.send(list)
        })
      })

      cy.visit('/')
      // check if Kiwi is the last fruit
      cy.get('li').should('have.length.gt', 3)
      .last().should('contain', 'Kiwi')
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
          res.delay(1000).send([])
        })
      })

      cy.visit('/')
      cy.get('.loader').should('be.visible')

      // once the network call finishes, the loader goes away
      cy.get('.loader').should('not.exist')
      cy.contains('.favorite-fruits', 'No favorites')
    })

    // NOTE: this does not work: cannot use cy commands inside the request handler
    it.skip('shows loading indicator (alternative)', function () {
      cy.route2('/favorite-fruits', (req) => {
        req.reply((res) => {
          cy.get('.loader').should('be.visible')
          res.send([])
        })
      })

      cy.visit('/')
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
        cy.route2('/favorite-fruits', [])
        cy.visit('/')
        cy.get('.favorite-fruits').should('have.text', 'No favorites')
      })
    })

    describe('when request fails', function () {
      it('displays error', function () {
        // you can be explicit with the reply
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

    it('displays error (short)', function () {
      // you can give the response object with status code
      cy.route2('/favorite-fruits', {
        statusCode: 500,
        body: '',
        headers: {
          'status-text': 'Orchard under maintenance',
        },
      })

      cy.visit('/')

      cy.get('.favorite-fruits')
      .should('have.text', 'Failed loading favorite fruits: Orchard under maintenance')
    })

    it('stubs a request that goes to another domain', () => {
      cy.visit('/')

      const users = [{
        id: '1',
        email: 'test@email.com',
        username: 'Test User',
      }]

      cy.route2('https://jsonplaceholder.cypress.io/users', {
        body: users,
        headers: {
          'access-control-allow-origin': Cypress.config('baseUrl'),
        },
      }).as('users')

      cy.get('#load-users').click()
      // ⚠️ response is text
      cy.wait('@users').its('response.body')
      .then(JSON.parse).should('have.length', 1)
      .its('0') // grab the first user from the list
      .should('deep.equal', users[0])

      // the user should be shown on the page
      cy.contains('.user', `${users[0].id} - ${users[0].email}`).should('be.visible')
    })

    describe('CSS', () => {
      it('highlights LI elements using injected CSS', () => {
        // let's intercept the stylesheet the application is loading
        // to highlight list items with a border
        cy.route2('styles.css', (req) => {
          // to avoid caching responses and the server responding
          // with nothing (because the resource has not changed)
          // and force the server to send the CSS file
          // delete caching headers from the request
          delete req.headers['if-modified-since']
          delete req.headers['if-none-match']

          req.reply((res) => {
            res.send(`${res.body}
              li {
                border: 1px solid pink;
              }
            `)
          })
        })

        cy.visit('/')
        // confirm the CSS was injected and applied
        cy.get('li').should('have.length.gt', 1).first().invoke('css', 'border')
        .should('be.a', 'string')
        .and('include', 'solid')
      })
    })
  })
})
