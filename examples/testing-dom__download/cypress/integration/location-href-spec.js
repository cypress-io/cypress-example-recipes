// @ts-check
/// <reference types="cypress" />
import {
  validateCsv, validateCsvFile, downloadByClicking,
  deleteDownloadsFolder,
} from './utils'
const path = require('path')

describe('file download', () => {
  beforeEach(deleteDownloadsFolder)

  const downloadsFolder = Cypress.config('downloadsFolder')

  context('using location.href', () => {
    describe('CSV file', () => {
      // NOTE: test times out because the browser stays on the CSV file URL
      it.skip('CSV file', () => {
        cy.visit('/')
        cy.get('[data-cy=download-csv-href]').click()
      })

      it('becomes the document after download', () => {
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

      it('grabbed via intercept', () => {
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
          validateCsv(csv)
        })
      })

      it('downloaded via cy.request', { browser: '!firefox' }, () => {
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
            const filename = path.join(downloadsFolder, 'records.csv')

            cy.writeFile(filename, csv, 'utf8')
            validateCsv(csv)
          })
        })
      })

      // NOTE: the Command Log says the file has been downloaded, but it's not there
      it.skip('downloaded via out own anchor click', () => {
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
          // we can go back to the original page
          cy.visit('/')
          downloadByClicking(downloadUrl, 'records.csv')
          // hmm, the file does not seem to be downloaded
          // despite the command log's message
          validateCsvFile('records.csv')
        })
      })
    })

    describe('PDF file', () => {
      // NOTE: work in progress, depends strongly on each browser
      it.skip('is downloaded', () => {
        cy.visit('/')
        cy.get('[data-cy=download-pdf-href]').invoke('attr', 'target', '_blank').click()
        cy.location('pathname').should('equal', '/why-cypress.pdf')
      })
    })
  })
})
