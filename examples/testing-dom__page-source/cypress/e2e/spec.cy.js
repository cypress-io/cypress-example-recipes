/// <reference types="cypress" />

describe('Page source', () => {
  Cypress.on('uncaught:exception', (err) => {
    // cypress.io has a few React exceptions related to state hydration,
    // but these exceptions do not impact this test
    // This is also true with Cannot read properties of null (reading 'addEventListener') which has to due with the osano library
    // that is on www.cypress.io
    if (err.message.includes('Minified React error') || err.message.includes(`Cannot read properties of null (reading 'addEventListener')`)) {
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
