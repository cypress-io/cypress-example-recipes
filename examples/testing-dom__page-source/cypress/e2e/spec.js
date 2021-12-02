/// <reference types="cypress" />

describe('Page source', () => {
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
