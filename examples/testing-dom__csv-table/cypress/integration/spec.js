/// <reference types="cypress" />
const neatCSV = require('neat-csv')

it('has table rows for each row of CSV file', () => {
  cy.visit('index.html')
  cy.readFile('records.csv')
  .then(neatCSV) // converts text into list of objects
  /* eslint-disable-next-line no-console */
  .then(console.table) // convenient method for printing list of objects in DevTools console
  .then((records) => {
    cy.get('table tr').should(($rows) => {
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
