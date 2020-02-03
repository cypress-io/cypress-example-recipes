/// <reference types="cypress" />
describe('Recipe: blogs__iframes', () => {
  it('gets the post using custom command', () => {
    cy.visit('index.html')
    cy.getIframeBody()
    .find('#run-button').should('have.text', 'Try it').click()

    cy.getIframeBody()
    .find('#result').should('include.text', '"delectus aut autem"')
  })
})
