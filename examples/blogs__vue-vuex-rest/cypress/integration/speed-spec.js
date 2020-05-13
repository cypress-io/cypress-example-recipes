/// <reference types="Cypress" />

let commands = []

Cypress.on('test:after:run', (attributes) => {
  /* eslint-disable no-console */
  console.log('Test "%s" has finished in %dms', attributes.title, attributes.duration)
  console.table(commands)
  commands.length = 0
})

Cypress.on('command:start', (c) => {
  commands.push({
    name: c.attributes.name,
    started: +new Date(),
  })
})

Cypress.on('command:end', (c) => {
  const lastCommand = commands[commands.length - 1]

  if (lastCommand.name !== c.attributes.name) {
    throw new Error('Last command is wrong')
  }

  lastCommand.endedAt = +new Date()
  lastCommand.elapsed = lastCommand.endedAt - lastCommand.started
})

describe('speed', () => {
  it('loads the app', () => {
    // reset the backend data
    cy.request({
      method: 'POST',
      url: '/reset',
      body: {
        todos: [],
      },
    })

    // load the application
    cy.visit('/')
    cy.get('.todoapp').should('be.visible')

    // add several todo items
    cy.get('.new-todo')
    .type('learn testing{enter}')
    .type('be cool{enter}')

    cy.get('.todo-list li')
    .should('have.length', 2)

    // delete one item and confirm it was deleted
    cy.server()
    cy.route('DELETE', '/todos/*').as('delete')
    cy.contains('.todo-list li', 'be cool').find('.destroy').click({ force: true })
    cy.wait('@delete')

    cy.get('.todo-list li')
    .should('have.length', 1)
  })

  it('stubs the network calls', () => {
    // if we stub all network calls,
    // there is no need to reset the backend data

    // stub all network calls
    cy.server()
    // initially return an empty list of todos
    cy.route('GET', '/todos', [])
    cy.route('POST', '/todos', {})
    cy.route('DELETE', '/todos/*', {}).as('delete')

    // load the application
    cy.visit('/')
    cy.get('.todoapp').should('be.visible')

    // add several todo items
    cy.get('.new-todo')
    .type('learn testing{enter}')
    .type('be cool{enter}')

    cy.get('.todo-list li')
    .should('have.length', 2)

    // delete one item and confirm it was deleted
    cy.contains('.todo-list li', 'be cool').find('.destroy').click({ force: true })
    cy.wait('@delete')

    cy.get('.todo-list li')
    .should('have.length', 1)
  })

  it('uses short strings', () => {
    // reset the backend data
    cy.request({
      method: 'POST',
      url: '/reset',
      body: {
        todos: [],
      },
    })

    // spy on the application's XHR calls
    cy.server()
    cy.route('DELETE', '/todos/*').as('delete')

    // load the application
    cy.visit('/')
    cy.get('.todoapp').should('be.visible')

    // add several todo items
    cy.get('.new-todo')
    .type('a{enter}')
    .type('b{enter}')

    cy.get('.todo-list li')
    .should('have.length', 2)

    // delete one item and confirm it was deleted

    cy.contains('.todo-list li', 'b').find('.destroy').click({ force: true })
    cy.wait('@delete')

    cy.get('.todo-list li')
    .should('have.length', 1)
  })
})
