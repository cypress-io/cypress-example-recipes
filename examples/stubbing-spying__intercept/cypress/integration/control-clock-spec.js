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
  context('clock', function () {
    describe('when favorite fruits are returned', function () {
      it('displays list of fruits', function () {
        // https://on.cypress.io/intercept
        cy.intercept('/favorite-fruits', ['Apple', 'Banana', 'Cantaloupe'])
        cy.visit('/')

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
        it('displays the new list of fruits', () => {
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

          cy.visit('/')
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
})
