/// <reference types="cypress" />

describe('Page source', () => {
  Cypress.on('uncaught:exception', (err) => {
    // cypress.io has a few React exceptions related to state hydration,
    // but these exceptions do not impact this test
    if (err.message.includes('Minified React error')) {
      return false
    }

    return true
  })

  it('gets the currently loaded document HTML', () => {
    cy.visit('/')
    cy.document().its('documentElement.outerHTML')
    .should('be.a', 'string')
    // let's show the HTML as text right in the browser
    // we need to sanitize the "<", ">", "&" characters
    .invoke('replace', /&/g, '&amp;')
    .invoke('replace', /</g, '&lt;')
    .invoke('replace', />/g, '&gt;')
    .then((sanitized) => {
      cy.document().invoke('write', sanitized)
    })
  })
})
