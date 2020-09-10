/// <reference types="cypress" />
const neatCSV = require('neat-csv')

describe('file download', () => {
  beforeEach(() => {
    cy.task('clearDownloads')
  })

  it('downloads CSV file', () => {
    cy.visit('/')
    cy.contains('h1', 'Download CSV')
    cy.get('[data-cy=download-csv]').click()

    cy.log('**read downloaded file**')

    // give the browser time to download the file
    // before trying to read it
    cy.wait(1000)

    // file path is relative to the working folder
    cy.readFile('./cypress/downloads/records.csv')
    // parse CSV text into objects
    .then(neatCSV)
    .then((list) => {
      expect(list, 'number of records').to.have.length(3)
      expect(list[0], 'first record').to.deep.equal({
        Age: '20',
        City: 'Boston',
        'First name': 'Joe',
        'Last name': 'Smith',
        Occupation: 'student',
        State: 'MA',
      })
    })
  })
})
