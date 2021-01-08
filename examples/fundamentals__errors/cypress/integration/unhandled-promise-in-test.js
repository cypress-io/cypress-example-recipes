/// <reference types="cypress" />

/* eslint-env browser */
/* eslint-disable no-console */
describe('Unhandled promises in the test code', () => {
  it('does not affect the Cypress test', () => {
    Cypress.Promise.delay(1000).then(() => {
      throw new Error('Test code has a rejected promise')
    })

    cy.visit('index.html')
    // because the promise will be rejected after one second
    // wait inside the test
    cy.wait(1100)
  })

  // NOTE: the test fails because we catch the unhandled promise rejection
  it.skip('fails test on unhandled rejection in the test code that uses Cypress.Promise', () => {
    // Cypress promises are Bluebird promises
    // https://on.cypress.io/promise
    // and have a callback for unhandled rejections
    // it will catch any rejected promises created using Cypress.Promise
    Cypress.Promise.onPossiblyUnhandledRejection((error, promise) => {
      throw error
    })

    Cypress.Promise.delay(1000).then(() => {
      throw new Error('Test code has a rejected promise')
    })

    cy.visit('index.html')
    // because the promise will be rejected after one second
    // wait inside the test
    cy.wait(1100)
  })

  // NOTE: the test fails because we catch the unhandled promise rejection
  it.skip('fails test on unhandled rejection in the test code that uses built-in Promise', () => {
    // note: since we are registering this event listener
    // on the spec's window and not on the application's window
    // Cypress does NOT reset it after every test
    window.addEventListener('unhandledrejection', (event) => {
      throw event.reason
    })

    // use the built-in browser promises,
    // reject it after one second
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Rejected native promise'))
      }, 1000)
    })

    cy.visit('index.html')
    // because the promise will be rejected after one second
    // wait inside the test
    cy.wait(1100)
  })
})
