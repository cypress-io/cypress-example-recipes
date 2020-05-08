/// <reference types="cypress" />
describe('TodoApp with Class Decorator', () => {
  it('sets TodoInput', () => {
    cy.visit('/')
    // a class decorator for TodoTextInput sets instance reference
    // as a property of the "window" object
    cy.window().its('TodoTextInput').invoke('handleSubmit', {
      which: 13, // Enter key
      target: {
        value: 'Try decorators',
      },
    })

    cy.get('li.todo').should('have.length', 1)
    .first().should('have.text', 'Try decorators')
  })

  it('creates Todo components', () => {
    cy.visit('/')
    cy.get('.new-todo').type('first{enter}').type('second{enter}').type('third{enter}')

    cy.window().its('TodoItem').should('have.length', 3)
    // let's complete second todo
    .its('1.props').then((props) => {
      props.completeTodo(props.todo.id)
    })

    // UI updates
    cy.get('li.todo').eq(1).should('have.class', 'completed')
  })
})
