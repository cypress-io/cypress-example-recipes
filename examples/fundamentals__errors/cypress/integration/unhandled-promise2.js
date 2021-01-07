/// <reference types="cypress" />

/* eslint-disable no-console */
describe('Unhandled promises using window event', () => {
  // we can bind to the events before each test using "cy.on()" call
  // or for all events using "Cypress.on()" call, usually placed into support file
  before(() => {
    Cypress.on('window:before:load', (win) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event
      win.addEventListener('unhandledrejection', (event) => {
        const msg = `UNHANDLED PROMISE REJECTION: ${event.reason}`

        // fail the test
        throw new Error(msg)
      })
    })
  })

  // NOTE: skipping the test because it shows how to fail the test for real
  it.skip('fails Cypress test if we register our own handler', () => {
    cy.visit('index.html')
    cy.get('button#promise').click()
    // the unhandled promise happens after 1000ms
    cy.wait(1500)
  })

  afterEach(() => {
    console.log('afterEach')
  })
})
