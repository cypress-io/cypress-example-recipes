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
      cy.intercept('/favorite-fruits', (req) => {
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
      cy.intercept('/favorite-fruits', {
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

      cy.intercept('https://jsonplaceholder.cypress.io/users', {
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

    describe('CSS', () => {
      it('highlights LI elements using injected CSS', () => {
        // let's intercept the stylesheet the application is loading
        // to highlight list items with a border
        cy.intercept('styles.css', (req) => {
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

    describe('HTML', () => {
      it('modifies the page itself', () => {
        const pageUrl = `${Cypress.config('baseUrl')}/`

        cy.intercept('/', (req) => {
          // we are only interested in the HTML root resource
          if (req.url !== pageUrl) {
            return
          }

          req.reply((res) => {
            const style = `
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              background-color: pink;
              text-align: center;
              text-size: large;
              padding: 1em;
            `

            res.body += `<footer style="${style}">⚠️ This is a Cypress test ⚠️</footer>`
          })
        })

        cy.visit('/')
        cy.contains('footer', 'Cypress test').should('be.visible')
      })
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

    it('reports any errors from the intercept as user application errors', () => {
      cy.visit('/')

      const errorMessage = 'Intercept gone wrong!'

      cy.intercept('POST', '/users', () => {
        // imagine we have an error in our intercept logic
        // it will fail the test
        throw new Error(errorMessage)
      })

      cy.on('uncaught:exception', (e) => {
        const text = 'The following error originated from your test code, not from Cypress.'

        if (!e.message.includes(text)) {
          // hmm, unexpected error text
          // return and fail the test
          return
        }

        if (e.message.includes(errorMessage)) {
          console.log('caught expected error')

          return false
        }

        return true
      })

      cy.get('#post-user').click()
    })
  })
})
