/// <reference types="cypress" />

import { seconds, testTimeout } from './timeout.cy'

describe('Global timeout of 3 seconds', () => {
  // the time limit applies to a single test, so set it before each one.
  // move this hook into a support file to limit every test in the project
  beforeEach(() => {
    testTimeout(seconds(3))
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
