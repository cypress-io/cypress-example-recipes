/// <reference types="cypress-file-upload" />
// See official documentation at https://github.com/abramenal/cypress-file-upload

describe('cypress-upload-file plugin', () => {
  beforeEach(() => {
    cy.visit('index.html')
  })

  it('uploads mock file', () => {
    // see how to mock a remote server
    // https://on.cypress.io/route
    cy.server()
    cy.route('POST', 'https://some-server.com/upload', 200).as('upload')

    // finds file at cypress/fixtures/test.txt
    cy.get('#file1').attachFile('test.txt')

    // make sure upload has happened
    cy.wait('@upload')
  })
})
