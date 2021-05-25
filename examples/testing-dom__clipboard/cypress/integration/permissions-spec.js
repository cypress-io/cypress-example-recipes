/// <reference types="cypress" />

// Permissions API specifically for clipboard information
// https://web.dev/async-clipboard/
// https://developer.mozilla.org/en-US/docs/Web/API/Permissions/query

describe('Clipboard permissions', () => {
  it('are granted on Electron', { browser: 'electron' }, () => {
    cy.visit('index.html') // yields the window object
    .its('navigator.permissions')
    // permission names taken from
    // https://w3c.github.io/permissions/#enumdef-permissionname
    .invoke('query', { name: 'clipboard-read' })
    .its('state')
    .should('equal', 'granted')
  })

  it('can be queried in Chrome', { browser: 'chrome' }, () => {
    cy.visit('index.html') // yields the window object
    .its('navigator.permissions')
    // permission names taken from
    // https://w3c.github.io/permissions/#enumdef-permissionname
    .invoke('query', { name: 'clipboard-read' })
    .its('state').should('be.oneOf', ['prompt', 'granted', 'denied'])
  })
})
