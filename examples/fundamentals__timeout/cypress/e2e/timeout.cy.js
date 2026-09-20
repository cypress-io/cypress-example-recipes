/// <reference types="cypress" />

/**
 * Converts seconds to milliseconds
 * @param {number} n Seconds to convert
 */
export const seconds = (n) => n * 1000

let timer = null

const clearTestTimer = () => {
  clearTimeout(timer)
  timer = null
}

// the time limit belongs to a single test,
// so drop the timer the moment that test ends
Cypress.on('test:after:run', clearTestTimer)

/**
 * Stops the current Cypress test if it takes longer than the provided timeout.
 * Call it inside a test, or inside a "beforeEach" hook to limit every test.
 * @param {number} ms Test timeout in milliseconds
 * @example
 *  // stop and fail the test if it runs for longer than 10 seconds
 *  testTimeout(seconds(10))
 */
export function testTimeout (ms) {
  clearTestTimer()

  // an error thrown from the timer fails whichever test is running,
  // and only the test that set the timer can still be running
  timer = setTimeout(() => {
    throw new Error(`Test ran longer than ${ms}ms`)
  }, ms)
}
