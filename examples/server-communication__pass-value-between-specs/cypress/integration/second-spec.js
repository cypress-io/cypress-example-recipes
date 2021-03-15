/// <reference types="cypress" />
describe('Second spec', () => {
  // just for our sake we can verify the object
  const expectedTodo = {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false,
  }

  it('has the saved item from the first spec', () => {
    // if the previous spec file has passed, we should have
    // the item stored in the plugin file
    cy.task('getItem', 'todo').should('deep.equal', expectedTodo)
  })
})
