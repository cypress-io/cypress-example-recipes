/// <reference types="cypress" />
/* eslint-disable mocha/no-global-tests */
const getIframeDocument = () => {
  return cy
  .get('iframe[src="https://jsonplaceholder.typicode.com/"]')
  // Cypress yields jQuery element, which has the real
  // DOM element under property "0".
  // From the real DOM iframe element we can get
  // the "document" element, it is stored in "contentDocument" property
  // Cypress "its" command can access deep properties using dot notation
  // https://on.cypress.io/its
  .its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  // get the document
  return getIframeDocument()
  // automatically retries until body is loaded
  .its('body').should('not.be.undefined')
  // wraps "body" DOM element to allow
  // chaining more Cypress commands, like ".find(...)"
  // https://on.cypress.io/wrap
  .then(cy.wrap)
}

describe('Recipe: blogs__iframes', () => {
  it('gets the post', () => {
    cy.visit('index.html')
    getIframeBody().find('#run-button').should('have.text', 'Try it').click()
    getIframeBody().find('#result').should('include.text', '"delectus aut autem"')
  })
})
