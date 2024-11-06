/// <reference types="cypress" />
describe('Two domains using file', () => {
  const filename = 'test-data.json'

  it('visits 1st domain', () => {
    cy.visit('https://example.cypress.io/')
    // there are several GitHub links on the page, make sure
    // to use the selector that returns a single item
    cy.get('[href="https://github.com/cypress-io/cypress-example-kitchensink"]').first()
    .invoke('attr', 'href')
    .then((url) => {
      expect(url).to.be.a('string')
      // save the value in a local file
      cy.writeFile(filename, JSON.stringify({ url }, null, 2))
    })
  })

  it('visits 2nd domain', () => {
    // we assume the first test has finished and stored URL in the file
    cy.readFile(filename).then(({ url }) => {
      // destructure the file into URL property
      expect(url).to.be.a('string')
      cy.visit(url)
    })

    // confirm the GitHub page loads
    cy.contains('[data-hovercard-type=organization]', 'cypress-io').should('be.visible')
  })
})
