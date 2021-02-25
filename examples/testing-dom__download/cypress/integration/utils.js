// @ts-check
const path = require('path')

export const validateCsvList = (list) => {
  expect(list, 'number of records').to.have.length(3)
  expect(list[0], 'first record').to.deep.equal({
    Age: '20',
    City: 'Boston',
    'First name': 'Joe',
    'Last name': 'Smith',
    Occupation: 'student',
    State: 'MA',
  })
}

export const validateExcelFile = () => {
  const downloadsFolder = Cypress.config('downloadsFolder')
  const downloadedFilename = path.join(downloadsFolder, 'people.xlsx')

  // ensure the file has been saved before trying to parse it
  cy.readFile(downloadedFilename, 'binary', { timeout: 15000 })
  .should((buffer) => {
    // by having length assertion we ensure the file has text
    // since we don't know when the browser finishes writing it to disk

    // Tip: use expect() form to avoid dumping binary contents
    // of the buffer into the Command Log
    expect(buffer.length).to.be.gt(100)
  })

  cy.log('**the file exists**')

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
}

export const validateImage = (downloadedFilename) => {
  const downloadsFolder = Cypress.config('downloadsFolder')

  if (!downloadedFilename) {
    downloadedFilename = path.join(downloadsFolder, 'logo.png')
  }

  // ensure the file has been saved before trying to parse it
  cy.readFile(downloadedFilename, 'binary', { timeout: 15000 })
  .should((buffer) => {
    // by having length assertion we ensure the file has text
    // since we don't know when the browser finishes writing it to disk

    // Tip: use expect() form to avoid dumping binary contents
    // of the buffer into the Command Log
    expect(buffer.length).to.be.gt(1000)
  })
}

export const validateTextFile = () => {
  const downloadsFolder = Cypress.config('downloadsFolder')
  const downloadedFilename = path.join(downloadsFolder, 'robots.txt')

  cy.readFile(downloadedFilename).should((text) => {
    // validate the downloaded robots.txt file
    const lines = text.split('\n')

    expect(lines).to.have.length.gt(2)
    expect(lines[0]).to.equal('User-agent: *')
  })
}

export const validateZip = () => {
  const downloadsFolder = Cypress.config('downloadsFolder')
  const downloadedFilename = path.join(downloadsFolder, 'files.zip')

  // wait for the file to be fully downloaded by reading it (as binary)
  // and checking its length
  cy.readFile(downloadedFilename, 'binary', { timeout: 15000 }).should('have.length.gt', 300)

  // unzipping and validating a zip file requires the direct access to the file system
  // thus it is easier to perform the checks from the plugins file that runs in Node
  // see the plugins file "on('task')" code to see how we can read and validate a Zip file
  cy.task('validateZipFile', downloadedFilename)
}
