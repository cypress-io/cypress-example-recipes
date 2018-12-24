/// <reference types="cypress" />

const TODO_ITEM_ONE = 'buy some cheese'
const TODO_ITEM_TWO = 'feed the cat'
const TODO_ITEM_THREE = 'book a doctors appointment'

/**
 * Creates default todo items using application action.
 * @example
 *  import { addDefaultTodos } from './utils'
 *  beforeEach(addDefaultTodos)
 */
export const addDefaultTodos = () => {
  cy.window()
    .its('model')
    .invoke('addTodo', TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE)
  cy.get('.todo-list li').as('todos')
}

/**
 * Creates given todos
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
    .invoke('addTodo', ...todos)
}

/**
 * Toggle given todo item. Returns chain so you can attach more Cypress commands
 * @param {number} k index of the todo item to toggle, 0 - first item
 * @example
 ```js
 import { addTodos, toggle } from './utils'
 it('completes an item', () => {
   addTodos('first')
   toggle(0)
 })
 ```
 */
export const toggle = (k = 0) =>
  cy
    .window()
    .its('model')
    .then(model => {
      expect(k, 'check item index').to.be.lessThan(model.todos.length)
      model.toggle(model.todos[k])
    })
