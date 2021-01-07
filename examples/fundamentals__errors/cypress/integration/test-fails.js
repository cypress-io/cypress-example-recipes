/// <reference types="cypress" />

/* eslint-disable no-console */
describe('Test fails', () => {
  // NOTE: run this test to see it fail because it tries to get an non-existent button
  it.skip('when the command fails', () => {
    cy.visit('index.html')
    cy.get('button#does-not-exist', { timeout: 1000 }).click()
  })

  it('can be ignored', () => {
    /**
     * By using "cy.on()" we can ignore the current test failing.
     * If you want to register this handler for all tests use "Cypress.on()"
     * @see https://on.cypress.io/catalog-of-events
     * @param {Error} e The exception we caught
     * @param {Mocha.Runnable} runnable is the current test or hook during which the error is caught
     */
    cy.on('fail', (e, runnable) => {
      console.log('error', e)
      console.log('runnable', runnable)

      // we can simply return false to avoid failing the test on uncaught error
      // return false
      // but a better strategy is to make sure the error is expected
      if (e.name === 'AssertionError' &&
        e.message.includes('Expected to find element: `button#does-not-exist`, but never found it')) {
        // we expected this error, so let's ignore it
        // and let the test continue
        return false
      }
      // on any other error message the test fails
    })

    cy.visit('index.html')
    cy.get('button#does-not-exist', { timeout: 1000 }).click()

    // note: after the cy.get fails and the test fails
    // the remaining commands are NOT executed
    // thus this failing assertion never gets to run
    cy.wrap(false).should('be.true')
  })
})
