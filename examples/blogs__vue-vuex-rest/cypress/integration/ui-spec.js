/* eslint-env mocha */
/* global cy, File */
import {
  resetDatabase,
  visit,
  getTodoApp,
  enterTodo,
  getTodoItems
} from './utils'

it('loads the app', () => {
  visit()
  getTodoApp().should('be.visible')
})

describe('UI', () => {
  beforeEach(resetDatabase)
  beforeEach(visit)

  context('basic features', () => {
    it('loads application', () => {
      getTodoApp().should('be.visible')
    })

    it('starts with zero items', () => {
      cy
        .get('.todo-list')
        .find('li')
        .should('have.length', 0)
    })

    it('adds two items', () => {
      enterTodo('first item')
      enterTodo('second item')
      getTodoItems().should('have.length', 2)
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
    cy.fixture('example.json').then(todos => {
      const text = JSON.stringify(todos)
      testFile = new File([text], 'example.json')
    })
    // sets test File object on the Vue component
    cy
      .window()
      .its('app')
      .then(app => {
        app.file = testFile
      })
    // triggers reading File object
    cy.get('#todo-file-upload').trigger('change')

    // asserts that items from test JSON file have been
    // rendered correctly by the component
    getTodoItems().should('have.length', 4)
    getTodoItems()
      .eq(1)
      .find('.toggle')
      .should('be.checked')
  })
})
