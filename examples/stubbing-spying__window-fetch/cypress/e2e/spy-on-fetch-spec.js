/// <reference types="Cypress" />

// Here, we let calls go through to the server
// but verify that the right call is made by spying on
// window.fetch
describe('spying', function () {
  beforeEach(function () {
    // We use cy.visit({onBeforeLoad: ...}) to spy on
    // window.fetch before any app code runs
    cy.visit('/', {
      onBeforeLoad (win) {
        cy.spy(win, 'fetch')
      },
    })
  })

  it('requests favorite fruits', function () {
    cy.window().its('fetch').should('be.calledWith', '/favorite-fruits')
  })

  it('displays favorite fruits', function () {
    cy.get('.favorite-fruits li').should('have.length', 5)
  })
})
