// @ts-check
/// <reference types="Cypress" />
import { recurse } from 'cypress-recurse'

describe('page reloads', () => {
  // ⛔️ THIS WILL NOT WORK
  // NOTE: eventually crashes, cannot use "while" loop with async commands
  it.skip('crashes when using while loop', () => {
    cy.visit('public/index.html')
    .then(() => {
      let found7 = false

      while (!found7) {
        // this schedules an infinite number
        // of "cy.get..." commands, eventually crashing
        // before any of them have a chance to run
        // and set found7 to true
        cy.get('#result').should('not.be.empty')
        .invoke('text').then(parseInt)
        .then((number) => {
          if (number === 7) {
            found7 = true
            cy.log('lucky **7**')
          } else {
            cy.wait(500, { log: false })
            cy.reload()
          }
        })
      }
    })
  })

  // ✅ the right way to schedule more commands
  // after checking the element on the page
  it('until the number 7 appears', () => {
    const checkAndReload = () => {
      // get the element's text, convert into a number
      cy.get('#result').should('not.be.empty')
      .invoke('text').then(parseInt)
      .then((number) => {
        // if the expected number is found
        // stop adding any more commands
        if (number === 7) {
          cy.log('lucky **7**')
        } else {
          // otherwise insert more Cypress commands
          // by calling the function after reload
          cy.wait(500, { log: false })
          cy.reload()
          checkAndReload()
        }
      })
    }

    cy.visit('public/index.html')
    checkAndReload()
  })

  it('until the number 7 appears with reload limit', () => {
    let reloadCount = 0
    const reloadLimit = 100

    const checkAndReload = () => {
      // get the element's text, convert into a number
      cy.get('#result', { log: false })
      .invoke({ log: false }, 'text').then(parseInt)
      .then((number) => {
        // if the expected number is found
        // stop adding any more commands
        if (number === 7) {
          cy.log('lucky **7**')
        } else {
          // otherwise insert more Cypress commands
          // by calling the function after reload
          cy.wait(500, { log: false })
          reloadCount += 1
          cy.log(`reload **${reloadCount} / ${reloadLimit}**`)
          if (reloadCount > reloadLimit) {
            throw new Error('Reload limit reached')
          }

          cy.reload({ log: false })
          checkAndReload()
        }
      })
    }

    cy.visit('public/index.html')
    checkAndReload()
  })

  it('until 7 appears using cypress-recurse', () => {
    // see https://github.com/bahmutov/cypress-recurse
    cy.visit('public/index.html')
    recurse(
      () => {
        cy.reload()

        return cy.get('#result', { log: false })
        .invoke({ log: false }, 'text').then(parseInt)
      },
      (x) => x === 7,
      {
        timeout: 10000, // try up to 10 seconds
        limit: 100, // try up to 100 times
      }
    )
  })

  it('still has window.Cypress after reload', () => {
    cy.visit('public/index.html')
    .should('have.property', 'appHasCypressPresent', true)

    cy.reload()
    .should('have.property', 'appHasCypressPresent', true)

    // reload a couple of times, still should have window.Cypress
    cy.reload().reload()
    cy.window()
    .then((win) => {
      expect(win).to.have.property('appHasCypressPresent', true)
    })
  })
})
