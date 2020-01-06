/// <reference types="cypress" />
import { addTodo, deleteTodo } from '../../src/actions'

describe('Redux store', () => {
  it('loads', () => {
    cy.visit('/')
    cy
    .focused()
    .should('have.class', 'new-todo')
    .and('have.attr', 'placeholder', 'What needs to be done?')

    cy.get('.todo-list li').should('have.length', 1).contains('Use Redux')
  })

  it('has expected state on load', () => {
    cy.visit('/')
    cy.window().its('store').invoke('getState').should('deep.equal', {
      todos: [
        {
          completed: false,
          id: 0,
          text: 'Use Redux',
        },
      ],
      visibilityFilter: 'show_all',
    })
  })

  it('is updated by the DOM actions', () => {
    cy.visit('/')
    cy.focused().type('Test with Cypress{enter}')
    cy.contains('li', 'Test with Cypress').find('input[type=checkbox]').click()
    cy.contains('.filters a', 'Completed').click()
    cy.window().its('store').invoke('getState').should('deep.equal', {
      todos: [
        {
          completed: false,
          id: 0,
          text: 'Use Redux',
        },
        {
          completed: true,
          id: 1,
          text: 'Test with Cypress',
        },
      ],
      visibilityFilter: 'show_completed',
    })
  })

  it('can wait for delayed updates', () => {
    cy.visit('/')
    cy.focused().type('first{enter}').type('second{enter}')
    // check the dom
    cy.get('.todo-list li').should('have.length', 3)
    // now redux store should have been updated
    cy.window().its('store').invoke('getState').its('todos').should('have.length', 3)
  })

  it('can wait for delayed updates using pipe', () => {
    cy.visit('/')
    cy.focused().type('first{enter}').type('second{enter}')
    const getTodos = (win) => {
      return win.store.getState().todos
    }

    // using cypress-pipe the "getTodos" will be retried until
    //   should('have.length', 3) passes
    //    or
    //   default command timeout ends
    cy.window().pipe(getTodos).should('have.length', 3)
  })

  it('can drive app by dispatching actions', () => {
    cy.visit('/')
    // dispatch Redux action
    cy
    .window()
    .its('store')
    .invoke('dispatch', { type: 'ADD_TODO', text: 'Test dispatch' })

    // check if the app has updated its UI
    cy.get('.todo-list li').should('have.length', 2).contains('Test dispatch')
  })

  const dispatch = (action) => cy.window().its('store').invoke('dispatch', action)

  it('can use actions from application code', () => {
    cy.visit('/')
    dispatch(addTodo('Share code'))
    dispatch(deleteTodo(0))
    cy.get('.todo-list li').should('have.length', 1).contains('Share code')
  })

  it('can set initial todos', () => {
    cy.visit('/', {
      onBeforeLoad: (win) => {
        win.initialState = [
          {
            id: 0,
            text: 'first',
            completed: true,
          },
          {
            id: 1,
            text: 'second',
            completed: false,
          },
          {
            id: 2,
            text: 'third',
            completed: true,
          },
        ]
      },
    })

    // there should be 3 items in the UI
    cy.get('.todo-list li').should('have.length', 3)
    // and 2 of them should be completed
    cy.get('.todo-list li.completed').should('have.length', 2)
  })

  const initialVisit = (url, fixture) => {
    cy.fixture(fixture).then((todos) => {
      cy.visit(url, {
        onBeforeLoad: (win) => {
          win.initialState = todos
        },
      })
    })
  }

  it('can set initial todos from a fixture', () => {
    initialVisit('/', '3-todos.json')
    // there should be 3 items in the UI
    cy.get('.todo-list li').should('have.length', 3)
    // and 2 of them should be completed
    cy.get('.todo-list li.completed').should('have.length', 2)
  })

  it('snapshots', () => {
    cy.visit('/')
    cy.focused().type('first{enter}').type('second{enter}').type('third{enter}')
    cy.contains('.todo-list li', 'second').find('input[type=checkbox]').click()
    cy.contains('.filters a', 'Completed').click()
    cy.window().its('store').invoke('getState').toMatchSnapshot()
  })
})
