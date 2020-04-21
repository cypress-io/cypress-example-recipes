/// <reference types="cypress" />
const neatCSV = require('neat-csv')

describe('CSV', () => {
  beforeEach(() => {
    cy.readFile('records.csv')
    .then(neatCSV) // converts text into list of objects
    .as('data')
    /* eslint-disable-next-line no-console */
    .then(console.table) // convenient method for printing list of objects in DevTools console
  })

  it('checks table using DOM aliases (slow)', function () {
    // convert list of objects into list of lists
    // rawData will be like
    // [ [Joe, Smith, student], [Mary, Sue, driver], ...]
    const rawData = this.data.map(Cypress._.values)

    cy.visit('index.html')

    cy.get('table tbody tr')
    // make sure the table has loaded
    .should('have.length.of', rawData.length - 1)
    .as('cyRows')

    for (let row = 0; row < rawData.length; row++) {
      cy.get('@cyRows')
      .eq(row)
      .find('td')
      .as('cyRowColumns')

      for (let column = 0; column < rawData[row].length; column++) {
        cy.get('@cyRowColumns')
        .eq(column)
        .should('contain', rawData[row][column])
      }
    }
  })

  it('has table rows for each row of CSV file (fast)', function () {
    const records = this.data

    cy.visit('index.html')
    cy.get('table tbody tr').should(($rows) => {
      // go through each row and confirm it shows the right information from CSV
      $rows.each((k, $row) => {
        const record = records[k]
        const $cells = $row.children

        expect($cells[0])
        .to.have.property('innerText')
        .equal(record['First name'])

        expect($cells[1])
        .to.have.property('innerText')
        .equal(record['Last name'])

        expect($cells[2])
        .to.have.property('innerText')
        .equal(record['Occupation'])
      })
    })
  })
})
