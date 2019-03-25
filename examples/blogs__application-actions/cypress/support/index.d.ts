/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Create several Todo items via UI
     * @example
     * cy.createDefaultTodos()
     */
    createDefaultTodos(): Chainable<any>
    /**
     * Creates one Todo using UI
     * @example
     * cy.createTodo('new item')
     */
    createTodo(title: string): Chainable<any>
  }
}

// Describes the TodoMVC model instance.
// Ideally it would come from the application,
// but in our example app does not have types,
// so we write method signatures ourselves.
// From out app actions we only use a couple of methods.
interface TodoModel {
  todos: unknown[]
  addTodo(...todos: string[])
  toggle(item: unknown)
  inform()
}
// During tests there we set "window.model" property
// now cy.window() returns Window instance with
// the "model" property that has TodoModel interface
interface Window {
  model: TodoModel
}
