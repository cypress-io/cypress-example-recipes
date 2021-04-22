/// <reference types="Cypress" />
/* eslint-disable no-console */
describe('intercept', () => {
  context('stubbing', function () {
    it('shows no Response message', () => {
      // stub server response with []
      cy.intercept('/favorite-fruits', [])
      cy.visit('/')
      cy.contains('No favorites').should('be.visible')
    })

    it('modifies the response from the server to insert Kiwi', () => {
      cy.intercept('favorite-fruits', (req) => {
        req.reply((res) => {
          // add Kiwi to the list received from the server
          console.log('original response from the server is %s %o', typeof res.body, res.body)
          const list = res.body

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
      cy.intercept('/favorite-fruits', (req) => {
        req.reply((res) => {
          res.setDelay(2000).send(['Pineapple 🍍'])
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
      cy.intercept('/favorite-fruits', (req) => {
        req.reply((res) => {
          // hmm, every time we want to return an empty list
          // we need to stringify it, otherwise the stub does not ... stub
          res.setDelay(1000).send([])
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
      cy.intercept('/favorite-fruits', (req) => {
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
      cy.intercept('/favorite-fruits').as('favoriteFruits')
      cy.visit('/')
      cy.wait('@favoriteFruits')

      cy.contains('a', 'Go to page 2').click()
      cy.url().should('match', /\/page2\.html$/)
      // the second page also requests the fruits
      cy.wait('@favoriteFruits')
    })

    it('can stub network calls for each page', () => {
      let k = 0

      // return difference responses on each call
      cy.intercept('/favorite-fruits', (req) => {
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
        cy.intercept('/favorite-fruits', ['Apple', 'Banana', 'Cantaloupe']).as('fetchFavorites')
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

      it('shows fruits', function () {
        const fruits = ['Apple', 'Banana', 'Cantaloupe']

        cy.intercept('/favorite-fruits', fruits)
        cy.visit('/')
        fruits.forEach((fruit) => {
          cy.contains('.favorite-fruits li', fruit)
        })
      })
    })

    describe('when no favorite fruits are returned', function () {
      it('displays empty message', function () {
        cy.intercept('/favorite-fruits', [])
        cy.visit('/')
        cy.get('.favorite-fruits').should('have.text', 'No favorites')
      })
    })

    describe('when request fails', function () {
      it('displays error', function () {
        // you can be explicit with the reply
        cy.intercept('/favorite-fruits', (req) => {
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
      cy.intercept({ url: '/favorite-fruits' }, {
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

      cy.intercept({ url: 'https://jsonplaceholder.cypress.io/users*' }, {
        body: users,
        headers: {
          'access-control-allow-origin': Cypress.config('baseUrl'),
        },
      }).as('users')

      cy.get('#load-users').click()
      cy.wait('@users').its('response.body')
      .should('have.length', 1)
      .its('0') // grab the first user from the list
      .should('deep.equal', users[0])

      // the user should be shown on the page
      cy.contains('.user', `${users[0].id} - ${users[0].email}`).should('be.visible')
    })

    it('stub or spy depending on the object sent', () => {
      cy.visit('/')
      cy.intercept('POST', '/users', (req) => {
        // inspect the request to decide if we want to mock it or not
        if (req.body.id === 101) {
          // ok, let's stub it, the server usually responds with the same object
          return req.reply(req.body)
        }

        // if we do not call req.reply, then the request goes to the server
        // and we can still spy on it
      }).as('postUser')

      cy.get('#post-user').click()
      cy.wait('@postUser')
    })

    it('can set an alias depending on the request', () => {
      cy.visit('/')
      cy.intercept('GET', '/users*', (req) => {
        // Inspect the request, and if it what we are looking for,
        // set the alias to assert against later. Very useful for
        // GraphQL requests!
        if (req.url.endsWith('/users?_limit=5')) {
          req.alias = 'load5'
        }
      })

      cy.get('#load-users').click()
      cy.get('#load-five-users').click()
      cy.wait('@load5') // the second request created this alias dynamically
      .its('response.body').should('have.length', 5)
    })

    it('any errors from the intercept fail the test', (done) => {
      cy.visit('/')

      const errorMessage = 'Intercept gone wrong!'

      cy.intercept('POST', '/users', () => {
        // imagine we have an error in our intercept logic
        // it will fail the test
        throw new Error(errorMessage)
      })

      cy.on('fail', (e) => {
        if (!e.message === errorMessage) {
          // hmm, unexpected error text
          // return and fail the test
          throw e
        }

        done()
      })

      cy.get('#post-user').click()
    })

    it('stubs all non-stubbed Ajax with 404', () => {
      // similar to the deprecated cy.server({ force:404 })

      // stop all fall-through Ajax application/json requests with a 404
      cy.intercept({
        headers: {
          accept: 'application/json',
        },
      }, {
        statusCode: 404,
      })

      // we want to stub this specific JSON call only
      cy.intercept('/favorite-fruits', { fixture: 'fruits.json' })

      cy.visit('/')
      cy.get('.favorite-fruits li').should('have.length', 3)
      // let's try non-stubbed network call - it should fail
      cy.get('#load-users').click()
      cy.contains('#users', 'Not Found').should('be.visible')
      // but we can still fetch fruits
      cy.reload()
      cy.get('.favorite-fruits li').should('have.length', 3)
      // yet another fetch is blocked
      cy.get('#load-five-users').click()
      cy.contains('#users', 'Not Found').should('be.visible')
    })

    it('stubs all Ajax but fruits with 404', () => {
      // similar to the deprecated cy.server({ force:404 })
      // we want to stub all Ajax calls but GET /favorite-fruits
      // now let's stop all other Ajax application/json requests
      cy.intercept('*', (req) => {
        if (req.method === 'GET' && req.url.endsWith('/favorite-fruits')) {
          // let the request go to the server
          return
        }

        if (req.headers.accept === 'application/json') {
          req.reply({
            statusCode: 404,
          })
        }
      })

      cy.visit('/')
      cy.get('.favorite-fruits li').should('have.length', 5)

      // let's try non-stubbed network call - it should fail
      cy.get('#load-users').click()
      cy.contains('#users', 'Not Found').should('be.visible')
      // but we can still fetch fruits
      cy.reload()
      cy.get('.favorite-fruits li').should('have.length', 5)
      // yet another fetch is blocked
      cy.get('#load-five-users').click()
      cy.contains('#users', 'Not Found').should('be.visible')
    })
  })
})
