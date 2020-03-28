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

Cypress.on('test:after:run', (attributes, test) => {
  testAttributesToSend = attributes
  // console.log('attributes %o', attributes)
  // console.log('test', test)
})
