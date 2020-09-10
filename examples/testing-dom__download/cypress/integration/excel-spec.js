/// <reference types="cypress" />
describe('file download', () => {
  beforeEach(() => {
    cy.task('clearDownloads')
  })

  it('downloads Excel file', () => {
    cy.visit('/')
    cy.contains('h1', 'Download XLSX')
    cy.get('[data-cy=download-xlsx]').click()

    cy.log('**read downloadeded file**')
    // file path is relative to the working folder
    cy.readFile('./cypress/downloads/records.xlsx')
    // parse Excel file into objects
    // .then(neatCSV)
    // .then((list) => {
    //   expect(list, 'number of records').to.have.length(3)
    //   expect(list[0], 'first record').to.deep.equal({
    //     Age: '20',
    //     City: 'Boston',
    //     'First name': 'Joe',
    //     'Last name': 'Smith',
    //     Occupation: 'student',
    //     State: 'MA',
    //   })
    // })
  })
})
