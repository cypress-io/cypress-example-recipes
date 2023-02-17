/// <reference types="cypress-file-upload" />
// See official documentation at https://github.com/abramenal/cypress-file-upload

describe('cypress-upload-file plugin', () => {
  beforeEach(() => {
    cy.visit('index.html')
  })

  it('uploads mock file', () => {
    // see how to mock network calls
    // https://on.cypress.io/intercept
    cy.intercept('POST', 'https://some-server.com/upload', {}).as('upload')

    // finds file at cypress/fixtures/test.txt
    cy.get('#file1').attachFile('test.txt')

    // make sure upload has happened
    cy.wait('@upload')
  })
})
