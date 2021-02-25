// @ts-check
/// <reference types="cypress" />
import { validateCsvList, validateExcelFile, validateTextFile, validateImage, validateZip } from './utils'
const neatCSV = require('neat-csv')
const path = require('path')

describe('file download', () => {
  const downloadsFolder = Cypress.config('downloadsFolder')

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
  })

  it('finds file', { browser: '!firefox', retries: 1 }, () => {
    // imagine we do not know the exact filename after download
    // so let's call a task to find the file on disk before verifying it
    // image comes from the same domain as the page
    cy.visit('/')
    cy.get('[data-cy=download-png]').click()

    // give the file time to download
    cy.wait(3000)

    cy.log('**find the image**')
    const mask = `${downloadsFolder}/*.png`

    cy.task('findFile', mask).then((foundImage) => {
      cy.log(`found image ${foundImage}`)
      cy.log('**confirm downloaded image**')
      validateImage()
    })
  })
})
