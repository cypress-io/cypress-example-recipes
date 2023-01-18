/// <reference types="cypress" />
describe('Two domains', () => {
  Cypress.on('uncaught:exception', (err) => {
    // cypress.io has a few React exceptions related to state hydration,
    // but these exceptions do not impact this test
    if (err.message.includes('Minified React error')) {
      return false
    }

    return true
  })

  it('visits 1nd domain', () => {
    cy.visit('https://www.cypress.io/')
    // there are several GitHub links on the page, make sure
    // to use the selector that returns a single item
    cy.get('[href="https://github.com/cypress-io/cypress"]').first()
    .invoke('attr', 'href')
    .then((url) => {
      // save the value in the `setupNodeEvents` process
      // that is preserved between browser page reloads
      expect(url).to.be.a('string')
      cy.task('saveUrl', url)
    })
  })

  it('visits 2nd domain', () => {
    // we assume the first test has finished
    // and stored the url
    cy.task('getUrl')
    .then((url) => {
      expect(url).to.be.a('string')
      cy.visit(url)
    })

    // confirm the GitHub page loads
    cy.contains('[data-hovercard-type=organization]', 'cypress-io').should('be.visible')
  })
})
