/// <reference types="cypress" />
describe('Recipe: blogs__iframes', () => {
  it('gets the post', () => {
    cy.visit('index.html').contains('XHR in iframe')
    cy.get('iframe')
  })
})
