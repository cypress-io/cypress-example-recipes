/// <reference types="cypress" />

describe('Sorting table', () => {
  it('sorts', () => {
    cy.visit('index.html')

    cy.get('#myGrid') // table
    .get('[role=rowgroup] .ag-row')
    .should('have.length', 3) // non-header rows

    cy.log('**sort by price**')
    cy.contains('[role=rowgroup] .ag-header-cell-label', 'Price').click()
    // check ↑ is visible
    cy.contains('[role=rowgroup] .ag-header-cell-label', 'Price')
    .find('[ref=eSortAsc]').should('be.visible')

    cy.get('[role=rowgroup] [col-id=price].ag-cell')
    .then((cells$) => Cypress._.map(cells$, 'textContent'))
    .then((prices) => Cypress._.map(prices, Number))
    .then((prices) => {
      const sorted = Cypress._.sortBy(prices)

      expect(prices, 'cells are sorted 📈').to.deep.equal(sorted)
    })
  })
})
