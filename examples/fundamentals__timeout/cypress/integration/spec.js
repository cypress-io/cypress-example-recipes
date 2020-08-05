/// <reference types="cypress" />
/* eslint-disable no-console */

const seconds = (n) => n * 1000

function testTimeout (ms) {
  const currentTest = cy.state('runnable')
  const startedAt = +new Date()

  setTimeout(() => {
    const testNow = cy.state('runnable')

    console.log('test started', currentTest)
    console.log('test now', testNow)
    console.log('test now state', testNow.state)

    if (currentTest !== testNow) {
      // different test already
      return
    }

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

describe('Test timeout', () => {
  it('allows short tests', () => {
    testTimeout(seconds(10))
    cy.wait(seconds(5))
  })

  // NOTE: enable to see test timeout in action
  it.skip('does not finish long tests', () => {
    testTimeout(seconds(2))
    cy.wait(seconds(10))
  })
})
