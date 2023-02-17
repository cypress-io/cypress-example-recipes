/// <reference types="cypress" />
/* global File */
describe('File upload', () => {
  beforeEach(() => {
    cy.visit('index.html')
  })

  it('uploads mock file and stubs the server', () => {
    // mock the network call using https://on.cypress.io/intercept
    cy.intercept('POST', 'https://some-server.com/upload', {}).as('upload')
    // load mock data from a fixture or construct here
    const testFile = new File(['data to upload'], 'upload.txt')

    cy.get('#file1').trigger('change', { testFile })
    // make sure upload has happened
    cy.wait('@upload')
  })

  it('uploads mock file by stubbing axios.post', () => {
    // see how to stub an object in the application environment
    // https://on.cypress.io/stub
    cy.window()
    .its('axios')
    .then((axios) => {
      // save stub under an alias
      cy.stub(axios, 'post').as('file-upload')
    })

    // load mock data from a fixture or construct here
    const testFile = new File(['data to upload'], 'upload.txt')

    cy.get('#file1').trigger('change', { testFile })
    // check stub has been used
    // https://on.cypress.io/assertions#Sinon-Chai
    cy.get('@file-upload').should('have.been.calledOnce')
  })
})
