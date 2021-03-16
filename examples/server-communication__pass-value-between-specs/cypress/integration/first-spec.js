/// <reference types="cypress" />
describe('First spec', () => {
  // just for our sake we can verify the object
  const expectedTodo = {
    userId: 1,
    id: 1,
    title: 'delectus aut autem',
    completed: false,
  }

  it('1 - stores the value', () => {
    // we could visit a page, save a value from the DOM
    // or make a network request and save the response
    const url = 'https://jsonplaceholder.cypress.io/todos/1'

    cy.request(url).its('body').then((todo) => {
      expect(todo).to.be.an('object')
      expect(todo).to.deep.equal(expectedTodo)

      cy.task('setItem', {
        name: 'todo',
        value: todo,
      })
    })
  })

  it('2 - has the saved item in the next test', () => {
    // if the previous test has passed, we should have
    // the item stored in the plugin file
    cy.task('getItem', 'todo').should('deep.equal', expectedTodo)
  })
})
