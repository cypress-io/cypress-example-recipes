/// <reference types="cypress" />
/* eslint-disable mocha/no-global-tests */
it('gets the post', () => {
  cy.visit('index.html').contains('XHR in iframe')
  cy.get('iframe')
})
