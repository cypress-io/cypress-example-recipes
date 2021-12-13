/// <reference types="Cypress" />
/* global File */
import { enterTodo, getNewTodoInput, getTodoApp, getTodoItems, resetDatabase, visit } from '../support/utils'

describe('first tests', () => {
  // very first two tests
  it('loads the app', () => {
    cy.visit('/')
    cy.get('.todoapp').should('be.visible')
  })

  // NOTE: enable this test only when the database is empty initially or to demonstrate failure
  it.skip('adds 2 todos', () => {
    cy.visit('http://localhost:3000')
    cy.get('.new-todo')
    .type('learn testing{enter}')
    .type('be cool{enter}')

    cy.get('.todo-list li')
    .should('have.length', 2)
  })
})

//
// more realistic tests with resetting data before each test
//
describe('UI', () => {
  beforeEach(resetDatabase)
  beforeEach(() => visit())

  context('basic features', () => {
    it('loads application', () => {
      getTodoApp().should('be.visible')
    })

    it('starts with zero items', () => {
      cy.get('.todo-list').find('li').should('have.length', 0)
    })

    it('adds two items', () => {
      enterTodo('first item')
      enterTodo('second item')
      getTodoItems().should('have.length', 2)
    })

    it('enters text in the input', () => {
      const text = 'do something'

      getNewTodoInput().type(text)
      getNewTodoInput().should('have.value', text)
    })

    it('can add many items', () => {
      const N = 100

      for (let k = 0; k < N; k += 1) {
        enterTodo(`item ${k + 1}`)
      }
      getTodoItems().should('have.length', N)
    })
  })

  context('advanced', () => {
    it('adds two and deletes first', () => {
      enterTodo('first item')
      enterTodo('second item')

      getTodoItems()
      .contains('first item')
      .parent()
      .find('.destroy')
      .click({ force: true }) // because it only becomes visible on hover

      cy.contains('first item').should('not.exist')
      cy.contains('second item').should('exist')
      getTodoItems().should('have.length', 1)
    })
  })

  it('uploads file with todos', () => {
    let testFile

    // reads test data from JSON file, makes test File object
    cy.fixture('example.json').then((todos) => {
      const text = JSON.stringify(todos)

      testFile = new File([text], 'example.json')
    })

    // sets test File object on the Vue component
    cy.window().its('app').then((app) => {
      app.file = testFile
    })

    // triggers reading File object
    cy.get('#todo-file-upload').trigger('change')

    // asserts that items from test JSON file have been
    // rendered correctly by the component
    getTodoItems().should('have.length', 4)
    getTodoItems().eq(1).find('.toggle').should('be.checked')
  })

  context('cy.tasks', () => {
    it('can observe records saved in the database', () => {
      const title = 'create a task'

      enterTodo(title)
      // https://on.cypress.io/task
      cy.task('hasSavedRecord', title, { timeout: 10000 })
    })

    it('returns resolved value', () => {
      const title = 'create a task'

      enterTodo(title)
      // https://on.cypress.io/task
      cy.task('hasSavedRecord', title, { timeout: 10000 })
      .should('contain', {
        title,
        completed: false,
      })
      // there is also an ID
      .and('have.property', 'id')
    })
  })
})
