// @ts-check
/// <reference types="cypress" />
import {
  validateCsvList, validateCsvFile, validateExcelFile,
  validateTextFile, validateImage, validateZip,
  validateBinaryFile, deleteDownloadsFolder,
} from './utils'
const neatCSV = require('neat-csv')
const path = require('path')

describe('file download', () => {
  beforeEach(deleteDownloadsFolder)

  const downloadsFolder = Cypress.config('downloadsFolder')

  // The next step tries to download an image file located in
  // the second domain. It runs in Chromium browsers with
  // "chromeWebSecurity": false, but we need to skip it in Firefox
  context('from remote domain localhost:9000', { browser: '!firefox' }, () => {
    it('CSV file', () => {
      cy.visit('/')
      cy.contains('h3', 'Download CSV')
      cy.get('[data-cy=download-remote-csv]').click()

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
      .then(validateCsvList)
    })

    it('CSV file attribute', () => {
      cy.visit('/')
      cy.contains('h3', 'Download CSV')
      cy.get('[data-cy=download-remote-csv]').should('have.attr', 'download')
      cy.get('[data-cy=download-remote-csv]').should('have.attr', 'href')
      .and('match', /\/records\.csv$/)

      cy.get('[data-cy=download-remote-csv]').click()
      validateCsvFile('records.csv')
    })

    it('Excel file', () => {
      cy.visit('/')
      cy.get('[data-cy=download-remote-xlsx]').click()

      cy.log('**confirm downloaded file**')

      validateExcelFile()
    })

    it('TXT file', () => {
    // the text file comes from a domain different from the page
      cy.visit('/')
      cy.get('[data-cy=download-remote-txt]').click()

      cy.log('**confirm downloaded text file**')
      validateTextFile()
    })

    it('PNG image', () => {
    // image comes from a domain different from the page
      cy.visit('/')
      cy.get('[data-cy=download-remote-png]').click()

      cy.log('**confirm downloaded image**')
      validateImage()
    })

    it('JS file', () => {
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

    it('ZIP archive', () => {
      cy.visit('/')
      cy.get('[data-cy=download-remote-zip]').click()

      cy.log('**confirm downloaded ZIP**')
      validateZip()
    })

    it('PDF', () => {
      cy.visit('/')
      cy.get('[data-cy=download-remote-pdf]').click()

      cy.log('**confirm downloaded PDF**')
      validateBinaryFile('why-cypress.pdf', 97672)
    })
  })

  context('using location.href', () => {
    // NOTE: test times out because the browser stays on the CSV file URL
    it.skip('CSV file', () => {
      cy.visit('/')
      cy.get('[data-cy=download-csv-href]').click()
    })

    it('CSV file becomes the document after download', () => {
      cy.visit('/')
      cy.intercept('GET', '*.csv', (req) => {
        req.reply((res) => {
          // show the CSV as plain text in the browser
          res.headers['content-type'] = 'text/html; charset=utf-8'
          res.send(res.body)
        })
      })

      cy.get('[data-cy=download-csv-href]').click()
      // the actual CSV file is NOT downloaded
      // the browser shows the CSV file url
      cy.location('pathname').should('be.equal', '/records.csv')
      // the contents of the CSV file is shown
      cy.contains('Adam').should('be.visible')
      // now that we have seen the CSV contents,
      // we can get back to the original HTML page
      cy.go('back')
    })

    it('CSV file intercept', () => {
      cy.visit('/')
      // we will set the CSV file contents in this variable
      let csv

      cy.intercept('GET', '*.csv', (req) => {
        req.reply((res) => {
          csv = res.body
          // redirect the browser back to the original page
          res.headers.location = '/'
          res.send(302)
        })
      })
      .as('csvDownload')

      cy.get('[data-cy=download-csv-href]').click()
      cy.wait('@csvDownload')
      // we should stay on the original URL
      cy.location('pathname').should('be.equal', '/')
      .then(() => {
        // by now the CSV variable should have CSV text
        cy.wrap(csv)
      })
      .then(neatCSV)
      .then(validateCsvList)
    })

    it('CSV file downloaded via cy.request', { browser: '!firefox' }, () => {
      cy.visit('/')
      let downloadUrl

      cy.intercept('GET', '*.csv', (req) => {
        downloadUrl = req.url
        req.reply({
          statusCode: 302,
          location: '/',
        })
      })

      cy.get('[data-cy=download-csv-href]').click()
      .should(() => {
        // retries until the intercept sets the download URL
        expect(downloadUrl).to.be.a('string')
      })
      .then(() => {
        // download URL ourselves and save as a file
        cy.request(downloadUrl).its('body').then((csv) => {
          // save so we have it as an artifact
          cy.writeFile('./cypress/downloads/records.csv', csv, 'utf8')
          .then(() => {
            // return CSV text for processing
            return csv
          })
        })
        // convert into a list and verify
        .then(neatCSV)
        .then(validateCsvList)
      })
    })
  })
})
