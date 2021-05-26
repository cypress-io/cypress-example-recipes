/// <reference types="cypress" />

// Permissions API specifically for clipboard information
// https://web.dev/async-clipboard/
// https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query

/* eslint-env browser */
describe('Clipboard permissions', () => {
  // Electron has access to the clipboard
  // https://www.electronjs.org/docs/api/clipboard#clipboard
  it('are granted in Electron', { browser: 'electron' }, () => {
    cy.visit('index.html') // yields the window object
    .its('navigator.permissions')
    // permission names taken from
    // https://w3c.github.io/permissions/#enumdef-permissionname
    .invoke('query', { name: 'clipboard-read' })
    .its('state')
    .should('equal', 'granted')
  })

  // we can safely query the current permission status in Chrome
  it('can be queried in Chrome', { browser: 'chrome' }, () => {
    cy.visit('index.html') // yields the window object
    .its('navigator.permissions')
    // permission names taken from
    // https://w3c.github.io/permissions/#enumdef-permissionname
    .invoke('query', { name: 'clipboard-read' })
    // by default it is "prompt" which shows a popup asking
    // the user if the site can have access to the clipboard
    // if the user allows, then next time it will be "granted"
    // If the user denies access to the clipboard, on the next
    // run the state will be "denied"
    .its('state').should('be.oneOf', ['prompt', 'granted', 'denied'])
  })

  it('can be granted in Chrome', { browser: 'chrome' }, () => {
    // use the Chrome debugger protocol to grant the current browser window
    // access to the clipboard from the current origin
    // https://chromedevtools.github.io/devtools-protocol/tot/Browser/#method-grantPermissions
    // We are using cy.wrap to wait for the promise returned
    // from the Cypress.automation call, so the test continues
    // after the clipboard permission has been granted
    cy.wrap(Cypress.automation('remote:debugger:protocol', {
      command: 'Browser.grantPermissions',
      params: {
        permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
        // make the permission tighter by allowing the current origin only
        // like "http://localhost:56978"
        origin: window.location.origin,
      },
    }))

    cy.visit('index.html') // yields the window object
    .its('navigator.permissions')
    // permission names taken from
    // https://w3c.github.io/permissions/#enumdef-permissionname
    .invoke('query', { name: 'clipboard-read' })
    .its('state').should('equal', 'granted')

    // now reading the clipboard from test will work
    // but only via navigator.clipboard - the document.execCommand
    // does nothing.
    cy.get('code').trigger('mouseover')
    cy.get('[aria-label="Copy"]').click()
    // confirm the clipboard's contents
    cy.window().its('navigator.clipboard')
    .invoke('readText')
    .should('equal', 'npm install -D cypress')

    // TODO how can we paste the clipboard into the text area?
    // right now the document.execCommand('paste') does not
    // do anything in the Chrome browser
  })
})
