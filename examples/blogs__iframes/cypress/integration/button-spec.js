/// <reference types="cypress" />
/* eslint-disable mocha/no-global-tests */
const getIframeDocument = () => {
  return cy
  .get('iframe[src="https://jsonplaceholder.typicode.com/"]')
  .its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  return getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap)
}

it('gets the post', () => {
  cy.visit('index.html')
  getIframeBody().find('#run-button').should('have.text', 'Try it').click()
  getIframeBody().find('#result').should('include.text', '"delectus aut autem"')
})
