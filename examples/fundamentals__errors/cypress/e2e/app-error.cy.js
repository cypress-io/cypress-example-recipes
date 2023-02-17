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
    // we can use hard-coded wait, see the other test
    // to learn how to avoid an unnecessary wait
    cy.wait(1500)
  })

  // if the test finishes before the error is thrown -
  // the test is still passing!
  // NOTE: just a demo of the test that does not wait for an error
  it.skip('does not wait for the error', () => {
    cy.visit('index.html')
    cy.get('button#error').click()
    // the thrown error is "lost" because the test finishes
  })

  // we can avoid hard-coded waits in the test
  // by using Cypress retry-ability
  // https://on.cypress.io/retry-ability
  it('waits for the error', () => {
    // place any caught errors in this object
    const caught = {
      message: null,
    }

    cy.on('uncaught:exception', (e) => {
      caught.message = e.message

      // ignore the error
      return false
    })

    cy.visit('index.html')
    cy.get('button#error').click()

    // waits for the error and confirms the message
    cy.wrap(caught).should((c) => {
      expect(c.message).to.include('Things went bad')
    })
  })
})
