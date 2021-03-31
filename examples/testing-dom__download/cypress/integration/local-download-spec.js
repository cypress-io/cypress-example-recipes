// @ts-check
/// <reference types="cypress" />
import {
  validateCsvList, validateCsvFile, validateExcelFile,
  validateTextFile, validateImage, validateZip,
  validateBinaryFile, deleteDownloadsFolder,
} from './utils'
import { recurse } from 'cypress-recurse'
const neatCSV = require('neat-csv')
const path = require('path')

describe('file download', () => {
  const downloadsFolder = Cypress.config('downloadsFolder')

  // should we delete all the files in the downloads folder
  // before each test?
  beforeEach(deleteDownloadsFolder)

  context('from local domain localhost:8070', () => {
    it('CSV file', () => {
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
      .then(validateCsvList)
    })

    it('CSV file using anchor href name', () => {
      cy.visit('/')
      cy.contains('h3', 'Download CSV')
      cy.get('[data-cy=download-csv]').click()

      // let's find out the download name
      cy.get('[data-cy=download-csv]').should('have.attr', 'download')
      cy.get('[data-cy=download-csv]').should('have.attr', 'href')
      .then((filename) => {
        expect(filename).to.match(/\.csv$/)
        cy.log(`CSV name **${filename}**`)
        //@ts-ignore
        validateCsvFile(filename)
      })
    })

    it('Excel file', () => {
      // let's download a binary file

      cy.visit('/')
      cy.contains('h3', 'Download XLSX')
      cy.get('[data-cy=download-xlsx]').click()

      cy.log('**confirm downloaded file**')

      validateExcelFile()
    })

    it('TXT file', { browser: '!firefox' }, () => {
      cy.visit('/')
      cy.get('[data-cy=download-txt]').click()

      cy.log('**confirm downloaded text file**')
      validateTextFile()
    })

    // limiting this test to Chrome browsers
    // since in FF we get a cross-origin request error
    it('PNG image', { browser: '!firefox' }, () => {
      // image comes from the same domain as the page
      cy.visit('/')
      cy.get('[data-cy=download-png]').click()

      cy.log('**confirm downloaded image**')
      validateImage()
    })

    it('ZIP archive', () => {
      cy.visit('/')
      cy.get('[data-cy=download-zip]').click()

      cy.log('**confirm downloaded ZIP**')
      validateZip()
    })

    it('PDF', { browser: '!firefox' }, () => {
      cy.visit('/')
      cy.get('[data-cy=download-pdf]').click()

      cy.log('**confirm downloaded PDF**')
      validateBinaryFile('why-cypress.pdf', 97672)

      // let's read PDF in the plugin file and confirm its basics
      cy.task('readPdf', './cypress/downloads/why-cypress.pdf')
      // @ts-ignore
      .then(({ numpages, text }) => {
        expect(numpages, 'number of PDF pages').to.equal(1)
        expect(text, 'has expected text').to.include('Why Cypress?')
      })
    })
  })

  context('finds file', () => {
    it('after waiting', { browser: '!firefox', retries: 1 }, () => {
      // imagine we do not know the exact filename after download
      // so let's call a task to find the file on disk before verifying it
      // image comes from the same domain as the page
      cy.visit('/')
      cy.get('[data-cy=download-png]').click()

      // give the file time to download
      cy.wait(3000)

      cy.log('**find the image**')
      const mask = `${downloadsFolder}/*.png`

      cy.task('findFiles', mask).then((foundImage) => {
        expect(foundImage).to.be.a('string')
        cy.log(`found image ${foundImage}`)
        cy.log('**confirm downloaded image**')
        validateImage()
      })
    })

    const isNonEmptyString = (x) => {
      return typeof x === 'string' && Boolean(x)
    }

    // quick unit test to confirm our predicate
    // function works as expected
    it('isNonEmptyString', () => {
      expect(isNonEmptyString()).to.be.false
      expect(isNonEmptyString(null)).to.be.false
      expect(isNonEmptyString('')).to.be.false
      expect(isNonEmptyString('logo.png')).to.be.true
    })

    it('using recurse', { browser: '!firefox' }, () => {
      // imagine we do not know the exact filename after download
      // so let's call a task to find the file on disk before verifying it
      // image comes from the same domain as the page
      cy.visit('/')
      cy.get('[data-cy=download-png]').click()

      cy.log('**find the image**')
      const mask = `${downloadsFolder}/*.png`

      recurse(
        () => cy.task('findFiles', mask),
        isNonEmptyString,
        {
          delay: 100, // pause 100ms between tries
          timeout: 10000, // iterate up to 10 seconds
        }
      )
      .then((foundImage) => {
        cy.log(`found image ${foundImage}`)
        cy.log('**confirm downloaded image**')
        validateImage()
      })
    })
  })
})
