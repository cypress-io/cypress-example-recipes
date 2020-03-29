/// <reference types="cypress" />

/* eslint-disable no-console */

let testAttributesToSend

const sendTestAttributes = () => {
  if (!testAttributesToSend) {
    return
  }

  console.log('sending test attributes: %s %s',
    testAttributesToSend.title, testAttributesToSend.state)

  const attr = testAttributesToSend

  testAttributesToSend = null

  cy.task('testFinished', attr)
}

beforeEach(sendTestAttributes)

after(sendTestAttributes)

// you cannot execute async code from event callbacks
// thus we need to be patient and send the test results
// when the next test starts, or after all tests finish
Cypress.on('test:after:run', (attributes, test) => {
  testAttributesToSend = attributes
})
