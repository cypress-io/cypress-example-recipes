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

describe('intercept', () => {
  context('slow', () => {
    // NOTE: skipping because without clock control this test takes 30 seconds!
    it.skip('fetches fruits every 30 seconds', () => {
      cy.intercept('/favorite-fruits').as('fetchFruits')
      cy.visit('/fruits.html')
      // confirm the first request happens
      cy.wait('@fetchFruits')
      // wait 30 seconds ...
      cy.wait(30000)
      // confirm the second request happens
      cy.wait('@fetchFruits').its('response.body')
      .then((fruits) => {
        cy.get('.favorite-fruits li')
        .should('have.length', fruits.length)

        fruits.forEach((fruit) => {
          cy.contains('.favorite-fruits li', fruit)
        })
      })
    })
  })

  context('clock', function () {
    describe('when favorite fruits are returned', function () {
      it('displays list of fruits', function () {
        // https://on.cypress.io/intercept
        cy.intercept('/favorite-fruits', ['Apple', 'Banana', 'Cantaloupe'])
        cy.visit('/fruits.html')

        cy.get('.favorite-fruits li').as('favoriteFruits')
        .should('have.length', 3)

        cy.get('@favoriteFruits').first()
        .should('have.text', 'Apple')

        cy.get('@favoriteFruits').eq(1)
        .should('have.text', 'Banana')

        cy.get('@favoriteFruits').eq(2)
        .should('have.text', 'Cantaloupe')
      })

      it('does not fetch for at least five seconds', () => {
        let polled

        cy.intercept('/favorite-fruits', () => {
          // we are not interested in the request
          // we just want to know it has happened
          polled = true
        })

        cy.visit('/fruits.html')
        // at some point the request happens
        // let's retry checking "polled" value until it happens
        cy.wrap()
        .should(() => {
          expect(polled, 'fetched fruits').to.be.true
          polled = false
        })

        // physically wait 5 seconds
        cy.wait(5000)
        .then(() => {
          expect(polled, 'no new requests').to.be.false
        })
      })

      it('does not fetch for at least five seconds (implicit syntax)', () => {
        // we will set a flag as a property in this object
        const network = {
          polled: true,
        }

        cy.intercept('/favorite-fruits', () => {
          // we are not interested in the request
          // we just want to know it has happened
          network.polled = true
        }).as('fruits')

        cy.visit('/fruits.html')
        // at some point the request happens
        // let's retry checking "polled" value until it becomes true
        cy.wrap(network).should('have.property', 'polled', true)
        // let the network call finish before we reset the property
        cy.wait('@fruits')
        .then(() => {
          network.polled = false
        })

        // physically wait 5 seconds
        cy.wait(5000)
        // new network calls have not happened
        cy.wrap(network).should('have.property', 'polled', false)
      })

      it('does not fetch for at least five seconds (counter)', () => {
        // we will set a flag as a property in this object
        const network = {
          polled: 0,
        }

        cy.intercept('/favorite-fruits', () => {
          // we are not interested in the request
          // we just want to know it has happened
          network.polled += 1
        })

        cy.visit('/fruits.html')
        // at some point the request happens
        // let's retry checking "polled" value until it gets value 1
        cy.wrap(network).should('have.property', 'polled', 1)

        // physically wait 5 seconds
        cy.wait(5000)
        // still the network call only happened once
        cy.wrap(network).should('have.property', 'polled', 1)
      })

      it('does not fetch for at least five seconds (cy.spy)', () => {
        cy.intercept('/favorite-fruits', cy.spy().as('reqForFruits'))

        cy.visit('/fruits.html')
        // at some point the request happens
        cy.get('@reqForFruits').should('have.been.calledOnce')

        // physically wait 5 seconds
        cy.wait(5000)
        // new network calls have not happened
        cy.get('@reqForFruits').should('have.been.calledOnce')
      })

      it('does not fetch for at least five seconds (synthetic clock)', () => {
        cy.clock()

        let polled

        cy.intercept('/favorite-fruits', () => {
          // we are not interested in the request
          // we just want to know it has happened
          polled = true
        })

        cy.visit('/fruits.html')
        // at some point the request happens
        // let's retry checking "polled" value until it happens
        cy.wrap().should(() => {
          // during the visit the network call happens
          expect(polled, 'fetched fruits').to.be.true
          // reset it back
          polled = false
        })

        // the test runner sleeps for 5 seconds
        cy.tick(5000)
        .then(() => {
          // and checks the "polled" value again
          expect(polled, 'no new network call').to.be.false
        })

        // but if we wait 25 more seconds, a network call happens again
        cy.tick(25000)
        cy.wrap()
        .should(() => {
          expect(polled, 'new fruits').to.be.true
        })
      })

      it('fetches every 30 seconds', () => {
        cy.clock()
        cy.intercept('/favorite-fruits', cy.spy().as('reqForFruits'))

        cy.visit('/fruits.html')
        // at some point the request happens
        cy.get('@reqForFruits').should('have.been.calledOnce')

        cy.tick(5000)

        // no new network calls
        cy.get('@reqForFruits').should('have.been.calledOnce')

        // but add 25 more seconds, and the app should have made a network call
        cy.tick(25000)
        cy.get('@reqForFruits').should('have.been.calledTwice')
      })
    })

    describe('polling every 30 secs', function () {
      it('fetches from the server (spies)', () => {
        cy.log('**start**')
        cy.clock()
        cy.intercept('GET', '/favorite-fruits').as('fruits')
        cy.visit('/fruits.html')
        // first call
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)

        // 30 seconds passes and the application fetches again
        cy.log('**30 seconds**')
        cy.tick(30000)
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)

        // 3rd call
        cy.log('**60 seconds**')
        cy.tick(30000)
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)

        // 4th call
        cy.log('**90 seconds**')
        cy.tick(30000)
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)

        // 5th call
        cy.log('**2 minutes**')
        cy.tick(30000)
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)

        // confirm the displayed fruits
        cy.get('@fruits').its('response.body')
        .then((fruits) => {
          expect(fruits).to.be.an('array')
          cy.get('.favorite-fruits li')
          .should('have.length', fruits.length)

          fruits.forEach((fruit, k) => {
            cy.log(`${k + 1}: ${fruit}`)
            cy.contains('.favorite-fruits li', fruit)
          })
        })
      })

      it('returns different fruits every 30 seconds', () => {
        cy.clock()
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

        cy.visit('/fruits.html')
        cy.contains('apples 🍎')
        cy.tick(30000)
        cy.contains('grapes 🍇')
        cy.tick(30000)
        cy.contains('kiwi 🥝')
      })

      it('returns different fruits every 30 seconds (array shift)', () => {
        cy.clock()

        // return difference responses on each call
        const responses = [
          ['apples 🍎'], ['grapes 🍇'],
        ]

        cy.intercept('/favorite-fruits', (req) => {
          req.reply(responses.shift() || ['kiwi 🥝'])
        })

        cy.visit('/fruits.html')
        cy.contains('apples 🍎')
        cy.tick(30000)
        cy.contains('grapes 🍇')
        cy.tick(30000)
        cy.contains('kiwi 🥝')
      })

      it('returns different fruits every 30 seconds (slow down)', () => {
        cy.clock()

        // return difference responses on each call
        const responses = [
          ['apples 🍎'], ['grapes 🍇'],
        ]

        cy.intercept('/favorite-fruits', (req) => {
          req.reply(responses.shift() || ['kiwi 🥝'])
        })

        cy.visit('/fruits.html')
        cy.contains('apples 🍎')
        // slow down the test on purpose to be able to see
        // the rendered page at each step
        cy.wait(1000)
        cy.tick(30000)
        cy.contains('grapes 🍇')
        cy.wait(1000)
        cy.tick(30000)
        cy.contains('kiwi 🥝')
      })

      it('returns different fruits every 30 seconds (slow down reply)', () => {
        cy.clock()

        // return difference responses on each call
        const responses = [
          ['apples 🍎'], ['grapes 🍇'],
        ]

        cy.intercept('/favorite-fruits', (req) => {
          const value = responses.shift() || ['kiwi 🥝']

          // wait 500ms then reply with the fruit
          // simulates the server taking half a second to respond
          return Cypress.Promise.delay(500, value).then(req.reply)
        })

        cy.visit('/fruits.html')
        cy.contains('apples 🍎')
        // slow down the test on purpose to be able to see
        // the rendered page at each step
        cy.wait(1000)
        cy.tick(30000)
        cy.contains('grapes 🍇')
        cy.wait(1000)
        cy.tick(30000)
        cy.contains('kiwi 🥝')
      })

      it('displays the new list of fruits (stubs)', () => {
        cy.clock()

        // first request - respond with 3 fruits
        // second request - respond with 4 fruits
        let k = 0
        const firstList = ['Apple', 'Banana', 'Cantaloupe']
        const secondList = ['Orange', 'Cherry', 'Raspberry', 'Pineapple']

        cy.intercept('/favorite-fruits', (req) => {
          k += 1
          if (k === 1) {
            req.reply(firstList)
          } else {
            req.reply(secondList)
          }
        })

        cy.visit('/fruits.html')
        cy.get('.favorite-fruits li').as('favoriteFruits')

        // initial list of fruits is shown
        cy.get('@favoriteFruits').should('have.length', firstList.length)
        firstList.forEach((fruit, j) => {
          cy.get('@favoriteFruits').eq(j)
          .should('have.text', firstList[j])
        })

        // move time 30 seconds and the setInterval will be triggered
        // that polls for the fruit
        cy.tick(30000)

        // make sure the updated list is shown
        cy.get('@favoriteFruits')
        .should('have.length', secondList.length)

        secondList.forEach((fruit, j) => {
          cy.get('@favoriteFruits').eq(j)
          .should('have.text', secondList[j])
        })
      })
    })
  })
})
