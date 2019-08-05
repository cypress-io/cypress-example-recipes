/// <reference types="cypress-file-upload" />
describe('cypress-upload-file plugin', () => {
  beforeEach(() => {
    cy.visit('index.html')
  })

  it('uploads mock file', () => {
    // see how to mock a remote server
    // https://on.cypress.io/route
    cy.server()
    cy.route('POST', 'https://some-server.com/upload', 200).as('upload')

    cy.get('#file1').upload(
      {
        fileContent: 'file contest',
        fileName: 'test.txt',
        mimeType: 'plain/text',
      },
      { subjectType: 'input' }
    )

    // make sure upload has happened
    cy.wait('@upload')
  })
})
