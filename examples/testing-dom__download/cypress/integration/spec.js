/// <reference types="cypress" />
describe('file download', () => {
  beforeEach(() => {
    cy.task('clearDownloads')
  })

  it('downloads CSV file', () => {
    cy.visit('/')
    cy.contains('h1', 'Download CSV')
    cy.get('[data-cy=download-csv]').click()

    cy.log('**read downloaded file**')
    // file path relative to the working folder
    cy.readFile('./cypress/downloads/records.csv')
  })
})
