/// <reference types="cypress" />

// Lodash is bundled with Cypress
// https://on.cypress.io/bundled-tools
const { _ } = Cypress

/* eslint-disable no-console */
describe('Sorting table', () => {
  it('sorts', () => {
    cy.visit('index.html')

    cy.get('#myGrid') // table
    .within(() => {
      cy.get('[role=rowgroup] .ag-row')
      .should('have.length', 3) // non-header rows

      cy.log('**sort by price**')
      cy.contains('.ag-header-cell-label', 'Price').click()
      // check ↑ is visible
      cy.contains('.ag-header-cell-label', 'Price')
      .find('[ref=eSortAsc]').should('be.visible')

      // verify the prices in the column are indeed in sorted order
      const cellsToPriceObjects = (cells$) => {
        return _.map(cells$, (cell$) => {
          return {
            price: Number(cell$.textContent),
            rowIndex: Number(cell$.parentElement.attributes['row-index'].value),
          }
        })
      }

      cy.get('[col-id=price].ag-cell')
      .then(cellsToPriceObjects)
      .then((prices) => {
        console.table(prices)

        // confirm prices are sorted
        // by sorting them ourselves
        // and comparing with the input list
        const sorted = _.sortBy(prices, 'rowIndex')

        // extract just the price numbers and check if they are sorted
        const justPrices = _.map(sorted, 'price')

        // default sort
        const sortedPrices = _.sortBy(justPrices)

        expect(justPrices, 'cells are sorted 📈').to.deep.equal(sortedPrices)
      })
    })
  })
})
