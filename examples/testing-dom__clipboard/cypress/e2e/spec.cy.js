/// <reference types="cypress" />

// The asynchronous Clipboard API is the only supported way to reach the
// clipboard from a test. Firefox and WebKit do not expose
// navigator.clipboard.readText() to the page, so these tests are limited
// to Chrome and Electron.
// https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API

/* eslint-env browser */
const copiedText = 'npm install -D cypress'

describe('Clipboard', { browser: ['chrome', 'electron'] }, () => {
  beforeEach(() => {
    if (Cypress.browser.name === 'chrome') {
      // Electron launches with the clipboard permission already granted.
      // Chrome starts in the "prompt" state, which would open a popup the test
      // cannot answer, so grant it through the Chrome DevTools Protocol.
      // https://chromedevtools.github.io/devtools-protocol/tot/Browser/#method-grantPermissions
      cy.wrap(Cypress.automation('remote:debugger:protocol', {
        command: 'Browser.grantPermissions',
        params: {
          permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
          // make the permission tighter by allowing the current origin only
          // like "http://localhost:56978"
          origin: window.location.origin,
        },
      }))
    }

    cy.visit('index.html')
  })

  const copyFromThePage = () => {
    // the page reveals the copy button on "mouseover"
    cy.get('code').trigger('mouseover')
    cy.get('[aria-label="Copy"]').click()
  }

  const readClipboard = () => {
    return cy.window().its('navigator.clipboard')
    .then((clip) => clip.readText())
  }

  it('copies the code snippet', () => {
    copyFromThePage()

    readClipboard().should('equal', copiedText)
  })

  it('pastes into a field that handles the paste event', () => {
    copyFromThePage()

    readClipboard().then((text) => {
      cy.get('#paste-here').then(($textarea) => {
        // build the event in the application's own window so the page receives
        // the DataTransfer it expects
        const win = $textarea[0].ownerDocument.defaultView
        const clipboardData = new win.DataTransfer()

        clipboardData.setData('text/plain', text)

        $textarea[0].dispatchEvent(new win.ClipboardEvent('paste', {
          clipboardData,
          bubbles: true,
          cancelable: true,
        }))
      })
    })

    cy.get('#paste-here').should('have.value', copiedText)
  })

  it('pastes into a field that reads the clipboard on Ctrl+V', () => {
    copyFromThePage()

    // cy.type sends the key events without performing a native paste, so this
    // works because the page reads the clipboard itself when it sees Ctrl+V.
    // Pages that only listen for the paste event need the test above instead.
    cy.get('#paste-on-shortcut').type('{ctrl}v')
    cy.get('#paste-on-shortcut').should('have.value', copiedText)
  })
})
