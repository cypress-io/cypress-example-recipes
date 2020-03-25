/// <reference types="cypress" />
describe('Two domains', () => {
  it('visits 1nd domain', () => {
    cy.visit('https://www.cypress.io/')
    cy.get('header [aria-label="Check out our github page"]')
    .invoke('attr', 'href')
    .then((url) => {
      expect(url).to.be.a('string')
      cy.task('saveUrl', url)
    })
  })

  it('visits 2nd domain', () => {
    cy.task('getUrl')
    .then((url) => {
      expect(url).to.be.a('string')
      cy.visit(url)
    })

    cy.contains('[data-hovercard-type=organization]', 'cypress-io').should('be.visible')
  })
})
