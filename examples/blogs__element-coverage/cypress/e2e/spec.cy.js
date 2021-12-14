/// <reference types="cypress" />
describe('Todo', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('works', function () {
    cy.get('.new-todo').type('first todo{enter}')
    cy.get('.new-todo').type('second todo{enter}')
    cy.get('.todo-list li').should('have.length', 2)
    .first().find(':checkbox').check()

    cy.contains('.filters a', 'Active').click()
    cy.contains('.filters a', 'Active').should('have.class', 'selected')

    cy.contains('.filters a', 'Completed').click()
    cy.contains('.filters a', 'Completed').should('have.class', 'selected')

    cy.contains('.filters a', 'All').click()
    cy.contains('.filters a', 'All').should('have.class', 'selected')
  })
})
