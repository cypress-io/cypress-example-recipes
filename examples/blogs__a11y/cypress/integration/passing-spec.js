/// <reference types="cypress" />
describe('A11y passes', () => {
  beforeEach(() => {
    cy.visit('index.html')
  })

  it('accessibility check', () => {
    cy.contains('This page should pass A11y checks')
    cy.injectAxe()
    cy.checkA11y()
  })
})
