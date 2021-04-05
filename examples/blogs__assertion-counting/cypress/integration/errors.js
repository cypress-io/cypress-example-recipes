/// <reference types="cypress" />

/* eslint-disable no-console */
describe('Unhandled promises', () => {
  // NOTE: this test will pass in Cypress < 7.0 and fail in Cypress 7.0+
  it.skip('does not affect the Cypress test in Cypress < 7.0', () => {
    cy.visit('index.html')
    cy.get('button#promise').click()
    // the unhandled promise happens after 1000ms
    cy.wait(1500)
    // but our test happily finishes
  })

  // NOTE: skipping the test because it shows how to fail the test for real
  it.skip('fails Cypress test if we register our own handler', () => {
    // we can install our handler to listen for unhandled rejected promises
    // in the application code and fail the test
    cy.visit('index.html', {
      onBeforeLoad (win) {
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event
        win.addEventListener('unhandledrejection', (event) => {
          const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`

          // fail the test
          throw new Error(msg)
        })
      },
    })

    cy.get('button#promise').click()
    // the unhandled promise happens after 1000ms
    cy.wait(1500)
  })

  afterEach(() => {
    console.log('afterEach')
  })
})
