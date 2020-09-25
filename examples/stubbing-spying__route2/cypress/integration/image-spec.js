/// <reference types="Cypress" />

describe('route2', () => {
  it('spies on loading a static image', () => {
    cy.route2('/images').as('image')
    cy.visit('/pics.html')
    // how to check if the /image route was called once?
    // cy.wait('@image')
  })

  // https://github.com/cypress-io/cypress/issues/8623
  // NOTE: seems to cause an infinite loop
  it.skip('stubs a static image', () => {
    // 🐅 -> kenguru
    cy.route2('/images', {
      fixture: 'roo.jpg',
      headers: { 'content-type': 'image/jpeg' },
    }).as('image')

    cy.visit('/pics.html')
  })
})
