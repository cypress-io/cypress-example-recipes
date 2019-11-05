/// <reference types="cypress" />
describe('application', function () {
  beforeEach(function () {
    // application prints "hello" to the console
    // during the page load, thus we need to create
    // our spy as soon as the window object is created but
    // before the page loads
    cy.visit('/index.html', {
      onBeforeLoad (win) {
        cy.spy(win.console, 'log').as('console.log')
      },
    })
  })

  it('prints hello on load', function () {
    cy.get('@console.log').should('be.calledWith', 'hello')
  })
})
