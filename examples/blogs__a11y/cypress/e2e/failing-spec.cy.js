/// <reference types="cypress" />
describe('A11y fails', () => {
  beforeEach(() => {
    cy.visit('index-bad.html')
  })

  it('loads', () => {
    cy.contains('p', 'hard to read')
  })

  // NOTE: skip this test on purpose - enable to see failing color contrast check
  it.skip('does not pass accessibility check', () => {
    cy.contains('p', 'hard to read')
    cy.injectAxe()
    cy.checkA11y()
  })
})
