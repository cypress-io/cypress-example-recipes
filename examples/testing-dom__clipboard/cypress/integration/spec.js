/// <reference types="cypress" />

// access to the clipboard reliably works in Electron browser
// in other browsers, there are popups asking for permission
// thus we should only run these tests in Electron
describe('Clipboard', { browser: 'electron' }, () => {
  it('copies text to clipboard', () => {
    cy.visit('index.html')
    cy.get('code').trigger('mouseover')
    cy.get('[aria-label="Copy"]').click()

    // let's check the copied text
    // on Chrome this operation will prompt the browser
    // to ask the user for permission:
    //  http://localhost:port wants to
    //  See text and images copied the clipboard
    cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('equal', 'npm install -D cypress')
  })

  it('shows the popup', () => {
    cy.visit('index.html')
    cy.get('code').trigger('mouseover')
    cy.get('[aria-label="Copy"]').click()

    cy.contains('.tinyToast', 'Copied!').should('be.visible')
    // the toast then goes away in less than 2 seconds
    cy.get('.tinyToast', { timeout: 2000 }).should('not.exist')
  })

  it('can set the clipboard text in the text area', () => {
    cy.visit('index.html')
    cy.get('code').trigger('mouseover')
    cy.get('[aria-label="Copy"]').click()

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

  it('falls back to document.execCommand if navigator does not support clipboard', () => {
    cy.visit('index.html', {
      onBeforeLoad (win) {
        // tip: to correctly delete a property from
        // the navigator, must delete it from its prototype
        delete win.navigator.__proto__.clipboard
      },
    })

    cy.document().then((doc) => cy.spy(doc, 'execCommand').as('execCommand'))
    cy.get('code').trigger('mouseover')
    cy.get('[aria-label="Copy"]').click()
    cy.get('@execCommand').should('have.been.calledOnceWith', 'copy')

    // we can paste the clipboard text
    cy.get('#paste-here').focus()
    cy.document().invoke('execCommand', 'paste')
    cy.get('#paste-here').should('have.value', 'npm install -D cypress')
  })

  it('writes text into clipboard', () => {
    cy.visit('index.html')
    // the document has to have focus before we can
    // write our text into the clipboard
    cy.get('#paste-here').focus()
    cy.window()
    .its('navigator.clipboard')
    .invoke('writeText', 'this is a test')

    // paste the clipboard into the text area
    cy.document().invoke('execCommand', 'paste')
    cy.get('#paste-here').should('have.value', 'this is a test')
  })
})
