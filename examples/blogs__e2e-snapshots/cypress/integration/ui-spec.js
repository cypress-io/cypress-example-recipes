/// <reference types="cypress" />
import {
  resetDatabase,
  visit,
  getTodoApp,
  enterTodo,
  getTodoItems,
  getNewTodoInput,
  toggle,
  getTodo,
  getCompleted,
} from '../support/utils'

describe('app', () => {
  it('loads', () => {
    visit()
    getTodoApp().should('be.visible')
  })
})

describe('UI', () => {
  beforeEach(resetDatabase)
  beforeEach(() => visit())

  context('basic features', () => {
    it('loads application', () => {
      getTodoApp().should('be.visible')
    })

    it('starts with zero items', () => {
      cy.get('.todo-list')
      .find('li')
      .should('have.length', 0)
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

    it('marks completed items assertions', () => {
      // actions
      enterTodo('first item')
      enterTodo('second item')
      enterTodo('item 3')
      enterTodo('item 4')
      toggle('item 3')
      toggle('item 4')
      // assertions
      getTodoItems().should('have.length', 4)
      getCompleted().should('have.length', 2)
      getTodo('first item')
      .find('[type="checkbox"]')
      .should('not.be.checked')

      getTodo('second item')
      .find('[type="checkbox"]')
      .should('not.be.checked')

      getTodo('item 3')
      .find('[type="checkbox"]')
      .should('be.checked')

      getTodo('item 4')
      .find('[type="checkbox"]')
      .should('be.checked')
    })

    it('marks completed items', () => {
      // actions
      enterTodo('first item')
      enterTodo('second item')
      enterTodo('item 3')
      enterTodo('item 4')
      toggle('item 3')
      toggle('item 4')
      // make sure app has rendered the toggled buttons
      getCompleted().should('have.length', 2)
      // single snapshot of entire <ul class="todo-list"> element
      cy.get('ul.todo-list').snapshot({
        name: 'todo-list with 2 completed items',
      })
    })
  })
})
