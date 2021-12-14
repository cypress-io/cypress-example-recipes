/// <reference types="cypress" />

describe('window.print', () => {
  it('can be stubbed', () => {
    cy.visit('index.html')
    cy.window().then((win) => {
      cy.stub(win, 'print').as('print')
    })

    cy.contains('button', 'Print').click()
    cy.get('@print').should('have.been.calledOnce')
  })
})
