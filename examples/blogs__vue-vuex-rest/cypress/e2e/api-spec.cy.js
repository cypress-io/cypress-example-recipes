/// <reference types="cypress" />
import { enterTodo, getTodoItems, makeTodo, resetDatabase, stubMathRandom, visit } from '../support/utils'

// testing TodoMVC server API
describe('via API', () => {
  beforeEach(resetDatabase)

  // used to create predictable ids
  let counter = 1

  beforeEach(() => {
    counter = 1
  })

  const addTodo = (title) => {
    return cy.request('POST', '/todos', {
      title,
      completed: false,
      id: String(counter++),
    })
  }

  const fetchTodos = () => cy.request('/todos').its('body')

  const deleteTodo = (id) => cy.request('DELETE', `/todos/${id}`)

  it('adds todo', () => {
    addTodo('first todo')
    addTodo('second todo')
    fetchTodos().should('have.length', 2)
  })

  it('adds todo deep', () => {
    addTodo('first todo')
    addTodo('second todo')
    fetchTodos().should('deep.equal', [
      {
        title: 'first todo',
        completed: false,
        id: '1',
      },
      {
        title: 'second todo',
        completed: false,
        id: '2',
      },
    ])
  })

  it('adds and deletes a todo', () => {
    addTodo('first todo') // id "1"
    addTodo('second todo') // id "2"
    deleteTodo('2')
    fetchTodos().should('deep.equal', [
      {
        title: 'first todo',
        completed: false,
        id: '1',
      },
    ])
  })
})

describe('Misc tests', () => {
// sets up spying on route "GET /todos" under name "todos"
  // after visiting the page
  // waits for the alias "todos" to make sure
  // the application has actually made the request
  it('loads todos on start', () => {
    cy.server()
    cy.route('/todos').as('todos')
    cy.visit('/')
    cy.wait('@todos')
  })

  // stubs expected API call with JSON response
  // from a fixture file
  it('loads todos from fixture file', () => {
    cy.server()
    // loads response from "cypress/fixtures/todos.json"
    cy.route('/todos', 'fixture:todos')
    cy.visit('/')
    getTodoItems()
    .should('have.length', 2)
    .contains('li', 'mock second')
    .find('.toggle')
    .should('be.checked')
  })

  it('initial todos', () => {
    cy.server()
    cy.route('/todos', [
      {
        title: 'mock first',
        completed: false,
        id: '1',
      },
      {
        title: 'mock second',
        completed: true,
        id: '2',
      },
    ])

    visit(true)
    getTodoItems()
    .should('have.length', 2)
    .contains('li', 'mock second')
    .find('.toggle')
    .should('be.checked')
  })
})

describe('API', () => {
  beforeEach(resetDatabase)
  beforeEach(() => visit(true))
  beforeEach(stubMathRandom)

  it('receives empty list of items', () => {
    cy.request('todos').its('body').should('deep.equal', [])
  })

  it('adds two items', () => {
    const first = makeTodo()
    const second = makeTodo()

    cy.request('POST', 'todos', first)
    cy.request('POST', 'todos', second)
    cy
    .request('todos')
    .its('body')
    .should('have.length', 2)
    .and('deep.equal', [first, second])
  })

  it('adds two items and deletes one', () => {
    const first = makeTodo()
    const second = makeTodo()

    cy.request('POST', 'todos', first)
    cy.request('POST', 'todos', second)
    cy.request('DELETE', `todos/${first.id}`)
    cy
    .request('todos')
    .its('body')
    .should('have.length', 1)
    .and('deep.equal', [second])
  })

  it('does not delete non-existent item', () => {
    cy
    .request({
      method: 'DELETE',
      url: 'todos/aaa111bbb',
      failOnStatusCode: false,
    })
    .its('status')
    .should('equal', 404)
  })

  it('is adding todo item', () => {
    cy.server()
    cy
    .route({
      method: 'POST',
      url: '/todos',
    })
    .as('postTodo')

    // go through the UI
    enterTodo('first item') // id "1"

    // thanks to stubbed random id generator
    // we can "predict" what the TODO object is going to look like
    cy.wait('@postTodo').its('request.body').should('deep.equal', {
      title: 'first item',
      completed: false,
      id: '1',
    })
  })

  it('is deleting a todo item', () => {
    cy.server()
    cy
    .route({
      method: 'DELETE',
      url: '/todos/1',
    })
    .as('deleteTodo')

    // go through the UI
    enterTodo('first item') // id "1"
    getTodoItems().first().find('.destroy').click({ force: true })

    cy.wait('@deleteTodo')
  })
})
