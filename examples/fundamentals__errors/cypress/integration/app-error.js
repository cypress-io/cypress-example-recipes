/// <reference types="cypress" />

/* eslint-disable no-console */
describe('App error', () => {
  // NOTE: run this test to see it fail on application error
  it.skip('fails the Cypress test', () => {
    cy.visit('index.html')
    cy.get('button#error').click()
    // the error happens after 1000ms
    cy.wait(1500)
  })

  it('can be ignored', () => {
    /**
     * By using "cy.on()" we can ignore an exception in the current test only.
     * If you want to register exception handler for all tests using "Cypress.on()"
     * @see https://on.cypress.io/catalog-of-events
     * @param {Error} e The exception we caught
     * @param {Mocha.Runnable} runnable is the current test or hook during which the error is caught
     */
    cy.on('uncaught:exception', (e, runnable) => {
      console.log('error', e)
      console.log('runnable', runnable)

      // we can simply return false to avoid failing the test on uncaught error
      // return false
      // but a better strategy is to make sure the error is expected
      if (e.message.includes('Things went bad')) {
        // we expected this error, so let's ignore it
        // and let the test continue
        return false
      }
      // on any other error message the test fails
    })

    cy.visit('index.html')
    cy.get('button#error').click()
    // the error happens after 1000ms
    cy.wait(1500)
  })
})
