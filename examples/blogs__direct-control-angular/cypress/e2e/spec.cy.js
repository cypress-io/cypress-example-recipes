/* eslint-disable no-console */
const getAngular = () => cy.window().its('angular')

const getElementScope = (selector) => {
  return cy.get(selector).then(($el) => getAngular().then((ng) => ng.element($el).scope()))
}

const getElementInjector = (selector) => {
  return cy
  .get(selector)
  .then(($el) => getAngular().then((ng) => ng.element($el).injector()))
}

const addTodo = (text) => cy.get('.new-todo').type(text).type('{enter}')

describe('Angular TodoMVC', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads page', () => {
    cy.title().should('include', 'AngularJS').and('include', 'TodoMVC')
  })

  it('adds a todo', () => {
    cy.get('.new-todo').type('new todo').type('{enter}')

    cy
    .get('.todo-list')
    .find('li')
    .should('have.length', 1)
    .first()
    .contains('new todo')
  })

  it('can get angular library', () => {
    cy
    .window()
    .then((win) => {
      console.log('got app window object', win)

      return win
    })
    .its('angular')
    .then((ng) => {
      console.log('got angular object', ng.version)
    })
  })

  it('has todo object in scope', () => {
    cy.get('.new-todo').type('new todo').type('{enter}')

    getElementScope('.todo-list li:first').its('todo').should('deep.equal', {
      title: 'new todo',
      completed: false,
    })
  })

  it('can get todo', () => {
    const title = 'learn E2E testing with Cypress'

    addTodo(title)

    getElementScope('.todo-list li:first').its('todo').should('deep.equal', {
      title,
      completed: false,
    })
  })

  it('can change todo via Angular scope', () => {
    const title = 'learn E2E testing with Cypress'

    addTodo(title)

    getElementScope('.todo-list li:first').its('todo').then((todo) => {
      todo.completed = true
    })

    getElementScope('.todo-list li:first').then((scope) => {
      // must run digest cycle so Angular
      // updates DOM
      scope.$apply()
    })

    // check UI - it should have been updated
    cy.get('.todo-list li:first').find('input.toggle').should('be.checked')
  })

  it('set several todos at once', () => {
    // home app handles missing "completed" property
    const todos = [
      {
        title: 'first todo',
      },
      {
        title: 'second todo',
      },
      {
        title: 'third todo',
      },
    ]

    getElementScope('.todo-list').then((scope) => {
      scope.todos = todos
      scope.$apply()
    })

    // we should have 3 elements in the list
    cy.get('.todo-list li').should('have.length', 3)
  })

  it('shows completed items', () => {
    // home app handles missing "completed" property
    const todos = [
      {
        title: 'first todo',
      },
      {
        title: 'second todo',
        completed: true,
      },
      {
        title: 'third todo',
      },
    ]

    getElementScope('.todo-list').then((scope) => {
      scope.todos = todos
      scope.$apply()
    })

    getElementInjector('.todo-list').then((injector) => {
      const store = injector.get('localStorage')

      todos.forEach((t) => store.insert(t))
    })

    cy.get('.filters').contains('Completed').click()

    cy.get('.todo-list li').should('have.length', 1)
  })

  it('sets todo using addTodo scope method', () => {
    getElementScope('.todo-list').then((scope) => {
      scope.newTodo = 'this is a todo'
      scope.addTodo()
      scope.$apply()
    })

    cy.get('.todo-list li').should('have.length', 1)
  })
})
