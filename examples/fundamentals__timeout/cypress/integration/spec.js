/// <reference types="cypress" />

import { seconds, testTimeout } from './timeout'

describe('Sets timeout in every test', () => {
  // this test runs fine, because it finishes
  // before the ten second limit expires
  it('allows 10 second tests, runs for 5 seconds', () => {
    testTimeout(seconds(10))
    cy.wait(seconds(5))
  })

  // this test fails after two seconds due to timeout
  // NOTE: enable to see test timeout in action
  it.skip('allows 2 second test, runs for 10 seconds (should fail)', () => {
    testTimeout(seconds(2))
    cy.wait(seconds(10))
  })
})
