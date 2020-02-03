/// <reference types="cypress" />
import { skipOn } from '@cypress/skip-test'

const getIframeDocument = () => {
  return cy
  .get('iframe[data-cy="the-frame"]')
  // Cypress yields jQuery element, which has the real
  // DOM element under property "0".
  // From the real DOM iframe element we can get
  // the "document" element, it is stored in "contentDocument" property
  // Cypress "its" command can access deep properties using dot notation
  // https://on.cypress.io/its
  // cy.its also waits for the property to exist
  .its('0.contentDocument')
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
  skipOn('firefox', () => {
    it('gets the post', () => {
      cy.visit('index.html')
      getIframeBody().find('#run-button').should('have.text', 'Try it').click()
      getIframeBody().find('#result').should('include.text', '"delectus aut autem"')
    })
  })
})
