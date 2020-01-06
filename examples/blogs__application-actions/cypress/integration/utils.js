/// <reference types="cypress" />

export const TODO_ITEM_ONE = 'buy some cheese'

export const TODO_ITEM_TWO = 'feed the cat'

export const TODO_ITEM_THREE = 'book a doctors appointment'

/**
 * App action to creates default todo items.
 *
 * @example
 *  import { addDefaultTodos } from './utils'
 *  beforeEach(addDefaultTodos)
 */
export const addDefaultTodos = () => {
  cy.window()
  .its('model')
  .should('be.an', 'object')
  .invoke('addTodo', TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE)

  cy.get('.todo-list li').as('todos')
}

/**
 * App action to create one or more todos.
 *
 * @example
  ```
  import { addTodos } from './utils'
  it('shows right counter', () => {
    addTodos(TODO_ITEM_ONE)
    cy.get('.todo-count').contains('1 item left')
    addTodos(TODO_ITEM_TWO)
    cy.get('.todo-count').contains('2 items left')
  })
  ```
 */
export const addTodos = (...todos) => {
  cy.window()
  .its('model')
  .should('be.an', 'object')
  .invoke('addTodo', ...todos)
}

/**
 * App action to toggle the given todo item.
 * Returns chain so you can attach more Cypress commands.
 * @param {number} k index of the todo item to toggle, 0 - first item
 *
 * @example
 ```js
 import { addTodos, toggle } from './utils'
 it('completes an item', () => {
   addTodos('first')
   toggle(0)
 })
 ```
 */
export const toggle = (k = 0) => {
  return cy
  .window()
  .its('model')
  .should('be.an', 'object')
  .then((model) => {
    expect(k, 'check item index').to.be.lessThan(model.todos.length)
    model.toggle(model.todos[k])
  })
}

const ALL_ITEMS = '.todo-list li'

/**
 * Returns all todo items on the page.
 *
 * @example
 ```
    import {allItems} from './utils'
    allItems().should('not.exist')
 ```
 */
export const allItems = () => cy.get(ALL_ITEMS)
