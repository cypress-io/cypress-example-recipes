// @ts-check
/// <reference types="cypress" />
import { validateCsvList, deleteDownloadsFolder } from './utils'
const neatCSV = require('neat-csv')

describe('file download', () => {
  beforeEach(deleteDownloadsFolder)

  context('form submission', () => {
    it('sends csv', () => {
      cy.visit('/')
      cy.contains('h3', 'Download from a form')

      // prepare for form submission that returns back a file
      // https://on.cypress.io/intercept
      cy.intercept({
        pathname: '/records.csv',
      }, (req) => {
        // instead of redirecting to the CSV file
        // and having the browser deal with it
        // download the file ourselves
        // but we cannot use Cypress commands inside the callback
        // thus we will download it later using the captured URL
        req.redirect('/')
      }).as('records')

      cy.get('button[data-cy=download-form-csv]').click()
      cy.wait('@records').its('request').then((req) => {
        cy.request(req)
        .then(({ body, headers }) => {
          expect(headers).to.have.property('content-type', 'text/csv; charset=utf-8')

          return neatCSV(body)
        }).then(validateCsvList)
      })
    })
  })
})
