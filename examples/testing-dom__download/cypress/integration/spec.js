/// <reference types="cypress" />
const neatCSV = require('neat-csv')
const path = require('path')

describe('file download', () => {
  // with respect to the current working folder
  const downloadsFolder = 'cypress/downloads'

  beforeEach(() => {
    cy.task('clearDownloads')

    // The next command allow downloads in Electron, Chrome, and Edge
    // without any users popups or file save dialogs.
    if (!Cypress.isBrowser('firefox')) {
      // since this call returns a promise, must tell Cypress to wait
      // for it to be resolved
      cy.log('Page.setDownloadBehavior')
      cy.wrap(
        Cypress.automation('remote:debugger:protocol',
          {
            command: 'Page.setDownloadBehavior',
            params: { behavior: 'allow', downloadPath: downloadsFolder },
          }),
        { log: false }
      )
    }
  })

  // unfortunately this does not work
  // https://github.com/cypress-io/cypress/issues/8594
  // beforeEach({ browser: '!firefox' }, () => {
  //   cy.wrap(
  //     Cypress.automation('remote:debugger:protocol',
  //       {
  //         command: 'Page.setDownloadBehavior',
  //         params: { behavior: 'allow', downloadPath: downloadsFolder },
  //       }),
  //     { log: false }
  //   )
  // })

  it('downloads CSV file', () => {
    cy.visit('/')
    cy.contains('h3', 'Download CSV')
    cy.get('[data-cy=download-csv]').click()

    cy.log('**read downloaded file**')

    // file path is relative to the working folder
    const filename = path.join(downloadsFolder, 'records.csv')

    // browser might take a while to download the file,
    // so use "cy.readFile" to retry until the file exists
    // and has length - and we assume that it has finished downloading then
    cy.readFile(filename, { timeout: 15000 })
    .should('have.length.gt', 50)
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

  it('downloads Excel file', () => {
    // let's download a binary file

    cy.visit('/')
    cy.contains('h3', 'Download XLSX')
    cy.get('[data-cy=download-xlsx]').click()

    cy.log('**confirm downloaded file**')

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
  })

  it('downloads TXT file', { browser: '!firefox' }, () => {
    cy.visit('/')
    cy.get('[data-cy=download-txt]').click()

    cy.log('**confirm downloaded text file**')
    const downloadedFilename = path.join(downloadsFolder, 'robots.txt')

    cy.readFile(downloadedFilename).should((text) => {
      // validate the downloaded robots.txt file
      const lines = text.split('\n')

      expect(lines).to.have.length.gt(2)
      expect(lines[0]).to.equal('User-agent: *')
    })
  })

  // limiting this test to Chrome browsers
  // since in FF we get a cross-origin request error
  it('downloads local PNG image', { browser: '!firefox' }, () => {
    // image comes from the same domain as the page
    cy.visit('/')
    cy.get('[data-cy=download-png]').click()

    cy.log('**confirm downloaded image**')

    const downloadedFilename = path.join(downloadsFolder, 'logo.png')

    // ensure the file has been saved before trying to parse it
    cy.readFile(downloadedFilename, 'binary', { timeout: 15000 })
    .should((buffer) => {
      // by having length assertion we ensure the file has text
      // since we don't know when the browser finishes writing it to disk

      // Tip: use expect() form to avoid dumping binary contents
      // of the buffer into the Command Log
      expect(buffer.length).to.be.gt(1000)
    })
  })

  // The next step tries to download an image file located in
  // the second domain. It runs in Chromium browsers with
  // "chromeWebSecurity": false, but we need to skip it in Firefox
  context('from remote domain', { browser: '!firefox' }, () => {
    it('downloads remote PNG image', () => {
    // image comes from a domain different from the page
      cy.visit('/')
      cy.get('[data-cy=download-remote-png]').click()

      cy.log('**confirm downloaded image**')
      const downloadedFilename = path.join(downloadsFolder, 'logo.png')

      // ensure the file has been saved before trying to parse it
      cy.readFile(downloadedFilename, 'binary', { timeout: 15000 })
      .should((buffer) => {
      // by having length assertion we ensure the file has text
      // since we don't know when the browser finishes writing it to disk

        // Tip: use expect() form to avoid dumping binary contents
        // of the buffer into the Command Log
        expect(buffer.length).to.be.gt(1000)
      })
    })

    it('downloads remote TXT file', () => {
    // the text file comes from a domain different from the page
      cy.visit('/')
      cy.get('[data-cy=download-remote-txt]').click()

      cy.log('**confirm downloaded text file**')
      const downloadedFilename = path.join(downloadsFolder, 'robots.txt')

      cy.readFile(downloadedFilename).should((text) => {
      // validate the downloaded robots.txt file
        const lines = text.split('\n')

        expect(lines).to.have.length.gt(2)
        expect(lines[0]).to.equal('User-agent: *')
      })
    })

    it('downloads remote JS file', () => {
    // the JavaScript file comes from a domain different from the page
      cy.visit('/')
      cy.get('[data-cy=download-remote-js]').click()

      cy.log('**confirm downloaded JavaScript file**')
      const downloadedFilename = path.join(downloadsFolder, 'analytics.js')

      cy.readFile(downloadedFilename).should((text) => {
      // validate the downloaded file
        const lines = text.split('\n')

        expect(lines).to.have.length.gt(20)
      })
    })

    // NOTE: because the file is downloaded from a domain we don't control
    it.skip('downloads remote CSV file', () => {
    // the site we are about to visit has an error on load,
    // so let's ignore it
      Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
        return false
      })

      cy.visit('https://www.appsloveworld.com/sample-csv-file/')
      cy.get('.Downloadbutton').first().click()

      cy.log('**confirm downloaded CSV file**')
      const downloadedFilename = path.join(downloadsFolder, 'Sample100.csv')

      cy.readFile(downloadedFilename, { timeout: 15000 })
      .should('have.length.gt', 100)
    })
  })
})
