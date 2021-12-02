/// <reference types="cypress" />
describe('CSV file', () => {
  it('parses', () => {
    cy.visit('index.html')
    cy.get('input#csv-file').attachFile('list.csv')
    // the CSV fixture file will be parsed and
    // the results will be set in the "window" property
    cy.window().should('have.prop', '__csvResults')
    .and('have.keys', ['data', 'errors', 'meta'])
    .its('errors').should('be.empty')

    // validate the parsed list
    cy.window().its('__csvResults.data').should('deep.equal',
      [{
        'First name': 'Joe',
        'Last name': 'Bravo',
      },
      { 'First name': 'Mike', 'Last name': 'Smith' }])
  })
})
