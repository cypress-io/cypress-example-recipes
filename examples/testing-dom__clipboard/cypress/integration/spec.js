/// <reference types="cypress" />

describe('Clipboard', () => {
  it('copies text to clipboard', () => {
    cy.visit('index.html')
    cy.get('code').trigger('mouseover')
    cy.get('[aria-label="Copy"]').click()

    cy.contains('.tinyToast', 'Copied!').should('be.visible')
    // the toast then goes away in less than 2 seconds
    cy.get('.tinyToast', { timeout: 2000 }).should('not.exist')

    // let's check the copied text
    cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('equal', 'npm install -D cypress')
    .then((text) => {
      // paste the text from the clipboard into the text area
      cy.get('#paste-here').click().invoke('val', text)
    })
  })

  it('spies on the clipboard methods', () => {
    cy.visit('index.html')
    cy.get('code').trigger('mouseover')
    cy.window().its('navigator.clipboard').then((clipboard) => {
      cy.spy(clipboard, 'writeText').as('writeText')
    })

    cy.get('[aria-label="Copy"]').click()
    cy.get('@writeText')
    .should('have.been.calledOnceWith', 'npm install -D cypress')
  })
})
