/// <reference types="cypress" />
describe('A11y fails', () => {
  beforeEach(() => {
    cy.visit('index-bad.html')
  })

  it('loads', () => {
    cy.contains('p', 'hard to read')
  })

  // skip this test on purpose - if you enable it
  // it will fail with color contrast error
  it.skip('does not pass accessibility check', () => {
    cy.contains('p', 'hard to read')
    cy.injectAxe()
    cy.checkA11y()
  })
})
