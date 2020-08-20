/// <reference types="cypress" />
/* eslint-disable no-console */

/**
 * Converts seconds to milliseconds
 * @param {number} n Seconds to convert
 */
export const seconds = (n) => n * 1000

/**
 * Stops the current Cypress test if it takes longer than the provided timeout
 * @param {number} ms Test timeout in milliseconds
 * @example
 *  // stop and fail the test if it runs for longer than 10 seconds
 *  testTimeout(10 * 1000)
 */
export function testTimeout (ms, test) {
  // get the current test reference using
  // the cy.state() magic method
  const currentTest = cy.state('runnable') || test

  if (!currentTest) {
    throw new Error('Could not determine current test')
  }

  const startedAt = +new Date()

  setTimeout(() => {
    const testNow = cy.state('runnable')

    console.log('test started', currentTest)
    console.log('test now', testNow)

    if (currentTest !== testNow) {
      // different test already
      return
    }

    console.log('test now state', testNow.state)
    if (testNow.state) {
      // test has finished
      return
    }

    const timeNow = +new Date()

    console.log('elapsed %d limit %d', timeNow - startedAt, ms)
    if (timeNow - startedAt >= ms) {
      throw new Error(`Test ran longer than ${ms}ms`)
    }
  }, ms)
}
