/// <reference types="cypress" />
describe('TodoApp with App Decorator', () => {
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
})
