/// <reference types="cypress" />

describe('Form submit', () => {
  // NOTE: This fails in Chrome >= 83, but succeeds in Chrome 80 and in Firefox
  it.skip('no explicit wait, this will fail but shouldn\'t', () => {
    cy.visit('')
    cy.get('select').pause().select('Second')
    cy.get('input').type('Hallo')
  })

  it('wait for URL change', () => {
    cy.visit('')
    cy.get('select').select('Second')
    cy.location('search').should('equal', '?')
    cy.get('input').type('Hallo')
  })

  it('wait for document network call', () => {
    cy.visit('')
    cy.intercept('/?').as('doc')
    cy.get('select').select('Second')
    cy.wait('@doc')
    cy.get('input').type('Hallo')
  })

  it('wait for window object to be refreshed', () => {
    cy.visit('')
    cy.window().then((w) => w.initial = true)
    cy.get('select').select('Second')
    cy.window().its('initial').should('be.undefined')
    cy.get('input').type('Hallo')
  })

  it('explicit wait after submit, this will succeed', () => {
    cy.visit('')
    cy.get('select').select('Second')
    cy.wait(1000)
    cy.get('input').type('Hallo')
  })

  // it('even a wait(0) will do', () => {
  //     cy.visit('')
  //     cy.get("select").select("Second")
  //     cy.wait(1000)
  //     cy.get("input").type("Hallo")
  // })
})
