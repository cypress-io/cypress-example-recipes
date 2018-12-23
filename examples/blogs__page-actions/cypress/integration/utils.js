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
  cy.window().its('model').invoke('addTodo',
    TODO_ITEM_ONE, TODO_ITEM_TWO, TODO_ITEM_THREE)
  cy.get('.todo-list li').as('todos')
}
