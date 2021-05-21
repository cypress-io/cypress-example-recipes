/// <reference types="cypress" />
/* global File */
describe('File upload', () => {
  beforeEach(() => {
    cy.visit('index.html')
  })

  it('uploads file by stubbing application code', () => {
    cy.intercept('POST', 'https://some-server.com/upload', {}).as('upload')

    // load mock data from a fixture or construct here
    const testFile = new File(['data to upload'], 'upload.txt')

    // directly stub the application method that returns the File object to upload
    cy.window()
    .its('app')
    .then((app) => {
      cy.stub(app, 'getFileToUpload')
      .returns(testFile)
      // give this stub an alias to confirm it was called
      .as('getFileToUpload')
    })

    cy.get('#file1').trigger('change', { testFile })

    // make sure our application stub worked
    cy.get('@getFileToUpload').should('have.been.calledOnce')

    // make sure upload has happened
    cy.wait('@upload')
  })
})
