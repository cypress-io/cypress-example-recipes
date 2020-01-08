/// <reference types="cypress" />
describe('Window confirm', () => {
  it('calls window confirm', () => {
    cy.visit('index.html')
    cy.on('window:confirm', (message) => {
      expect(message).to.equal('Are you sure?')
    })

    cy.get('#click').click()
  })
})
