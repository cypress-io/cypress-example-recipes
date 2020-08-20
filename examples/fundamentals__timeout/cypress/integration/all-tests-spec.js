/// <reference types="cypress" />

import { seconds, testTimeout } from './timeout'

describe('Global timeout of 3 seconds', () => {
  // Let's try to time limit _every test_

  // first attempt: using "beforeEach" hook to call testTimeout
  // DOES NOT WORK - the hook has its own runnable context, but
  // does not have access to the test to be executed
  // context('of 3 seconds in every test', () => {
  //   beforeEach(() => {
  //     testTimeout(seconds(3))
  //   })

  //   it('runs for 1 second', () => {
  //     cy.wait(1000)
  //   })

  //   it.skip('runs for 5 seconds (should fail)', () => {
  //     cy.wait(5000)
  //   })
  // })

  // second attempt: using 'test:before:run' event
  // this WORKS, make sure to pass the test object
  // from the event callback's arguments
  context('of 3 seconds in every test', () => {
    // IMPORTANT: while this event listener is defined inside a suite
    // it is called _for every test_.
    Cypress.on('test:before:run', function (attributes, test) {
      // during this event, we get the test instance from the arguments
      testTimeout(seconds(3), test)
    })

    it('runs for 1 second', () => {
      cy.wait(1000)
    })

    // NOTE: enable to see the test failing after the timeout
    it.skip('runs for 5 seconds (should fail)', () => {
      cy.wait(5000)
    })

    it('runs for 1 second again', () => {
      cy.wait(1000)
    })

    it('runs for 1 second once more', () => {
      cy.wait(1000)
    })
  })
})
