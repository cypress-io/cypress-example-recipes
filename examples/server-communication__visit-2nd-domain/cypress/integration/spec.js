/// <reference types="cypress" />
describe('Two domains', () => {
  it('visits 1nd domain', () => {
    cy.visit('https://www.cypress.io/')
    // there are several GitHub links on the page, make sure
    // to use the selector that returns a single item
    cy.get('header [aria-label="Check out our github page"]')
    .should('have.length', 1)
    // from the jQuery wrapping <a href="https://github.io ..." />
    // get the "href" value
    .invoke('attr', 'href')
    .then((url) => {
      // save the value in the plugins process
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
