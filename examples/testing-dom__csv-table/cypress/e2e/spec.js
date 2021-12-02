/// <reference types="cypress" />
const neatCSV = require('neat-csv')

/* eslint-disable no-console */

Cypress.on('test:after:run', (attributes) => {
  console.log('Test "%s" has finished in %dms', attributes.title, attributes.duration)
})

describe('CSV', () => {
  let table

  before(() => {
    cy.readFile('records.csv')
    .then(neatCSV) // converts text into list of objects
    .then((data) => {
      table = data
    })
    .then(console.table) // convenient method for printing list of objects in DevTools console
  })

  it('checks table using DOM aliases (slow)', () => {
    // convert list of objects into list of lists
    // rawData will be like
    // [ [Joe, Smith, student], [Mary, Sue, driver], ...]
    const rawData = table.map(Cypress._.values)

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

  it('has table rows for each row of CSV file 🏃‍♂', () => {
    cy.visit('index.html')
    cy.get('table tbody tr').should(($rows) => {
      // go through each row and confirm it shows the right information from CSV
      $rows.each((k, $row) => {
        const record = table[k]
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

  it('checks entire table row 🏇', () => {
    // convert list of objects into list of lists
    // rawData will be like
    // [ [Joe, Smith, student], [Mary, Sue, driver], ...]
    const rawData = table.map(Cypress._.values)

    cy.visit('index.html')
    cy.get('table tbody tr').should(($rows) => {
      // go through each row and confirm it shows the right information from CSV
      $rows.each((k, $row) => {
        const record = rawData[k]
        const cells = Cypress._.map($row.children, 'innerText')

        expect(cells).to.deep.equal(record)
      })
    })
  })

  it('checks entire object of values from DOM 🚀', () => {
    // convert list of objects into list of lists and then flatten
    // rawValues will be a single array
    // [Joe, Smith, student, Mary, Sue, driver, ...]
    const rawValues = Cypress._.flatten(table.map(Cypress._.values))

    cy.visit('index.html')
    cy.get('table tbody').then((tbody) => {
      const cells = tbody.find('td')
      const values = Cypress._.map(cells, 'innerText')

      expect(values).to.deep.equal(rawValues)
    })
  })
})
