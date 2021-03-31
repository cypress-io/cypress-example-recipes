/// <reference types="Cypress" />
describe('intercept', { viewportHeight: 300 }, () => {
  it('returns standard headers', () => {
    cy.visit('/headers')
    cy.get('#get-headers').click()
    // no custom headers
    cy.contains('#output', 'accept-language')
    .should('not.contain', 'x-custom-header')
  })

  it('adds request header', () => {
    cy.visit('/headers')
    cy.intercept('/req-headers', (req) => {
      // note: this header will NOT be shown in the browser's
      // Network tab, as the request has already left the browser
      // when this header is added
      req.headers['x-custom-headers'] = 'added by cy.intercept'
    })

    cy.get('#get-headers').click()
    cy.contains('#output', 'accept-language')
    .should('contain', 'x-custom-header')
    .and('contain', 'added by cy.intercept')
  })

  it('adds request header', () => {
    cy.visit('/headers')
    cy.intercept('/req-headers', (req) => {
      // note: this header will NOT be shown in the browser's
      // Network tab, as the request has already left the browser
      // when this header is added
      req.headers['x-custom-headers'] = 'added by cy.intercept'
    }).as('headers')

    cy.get('#get-headers').click()
    // but the custom request header added by the intercept
    // will be in object we can get by waiting on the intercept
    cy.wait('@headers').its('request.headers')
    .should('have.property', 'x-custom-headers', 'added by cy.intercept')
  })
})
