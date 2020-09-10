/// <reference types="cypress" />
describe('file download', () => {
  beforeEach(() => {
    cy.task('clearDownloads')
  })

  it('downloads Excel file', () => {
    cy.visit('/')
    cy.contains('h1', 'Download XLSX')
    cy.get('[data-cy=download-xlsx]').click()

    cy.log('**read downloaded file**')
    // give the browser time to download the file
    // before trying to read it
    cy.wait(1000)

    const downloadedFilename = './cypress/downloads/people.xlsx'

    // the first utility library we use to parse Excel files
    // only works in Node, thus we can read and parse
    // the downloaded file using cy.task
    cy.task('readExcelFile', downloadedFilename)
    // returns an array of lines read from Excel file
    .should('have.length', 4)
    .then((list) => {
      expect(list[0], 'header line').to.deep.equal([
        'First name', 'Last name', 'Occupation', 'Age', 'City', 'State',
      ])

      expect(list[1], 'first person').to.deep.equal([
        'Joe', 'Smith', 'student', 20, 'Boston', 'MA',
      ])
    })
  })
})
