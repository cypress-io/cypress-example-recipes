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
  it('shows loading element', () => {
    cy.intercept('/favorite-fruits', {
      body: ['Apple', 'Banana', 'Cantaloupe'],
      delay: 1000,
    })

    cy.visit('/fruits.html')
    // see https://glebbahmutov.com/blog/negative-assertions/
    cy.get('.loader').should('be.visible')
    cy.get('.loader').should('not.exist')
  })

  it('shows loading element for as little as possible', () => {
    // see https://blog.dai.codes/cypress-loading-state-tests/
    let sendResponse
    const trigger = new Cypress.Promise((resolve) => {
      // save the resolve method
      // so this promise resolves when we call it
      sendResponse = resolve
    })

    cy.intercept('/favorite-fruits', (req) => {
      // wait for the trigger to be called
      trigger.then(() => req.reply(['Apple', 'Banana', 'Cantaloupe']))
    })

    cy.visit('/fruits.html')
    cy.get('.loader').should('be.visible').then(sendResponse)
    cy.get('.loader').should('not.exist')
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
        cy.clock()
        cy.intercept('GET', '/favorite-fruits').as('fruits')
        cy.visit('/fruits.html')
        // first call
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)

        // 30 seconds passes and the application fetches again
        cy.tick(30000)
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)

        // 3rd call
        cy.tick(30000)
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)

        // 4th call
        cy.tick(30000)
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)

        // 5th call
        cy.tick(30000)
        cy.wait('@fruits').its('response.statusCode').should('equal', 200)
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
