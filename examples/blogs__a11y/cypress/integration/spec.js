/// <reference types="cypress" />
describe('A11y', () => {
  beforeEach(() => {
    cy.visit('index.html')
  })

  it('loads', () => {
    cy.contains('p', 'hard to read')
  })

  it.only('does not pass accessibility check', () => {
    cy.injectAxe()
    cy.checkA11y()
  })
})
