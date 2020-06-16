/// <reference types="Cypress" />

let commands = []
let testAttributes

// sends test results to the plugins process
// using cy.task https://on.cypress.io/task
const sendTestTimings = () => {
  if (!testAttributes) {
    return
  }

  const attr = testAttributes

  testAttributes = null

  cy.task('testTimings', attr)
}

beforeEach(sendTestTimings)

after(sendTestTimings)

Cypress.on('test:before:run', () => {
  commands.length = 0
})

Cypress.on('test:after:run', (attributes) => {
  /* eslint-disable no-console */
  console.log('Test "%s" has finished in %dms', attributes.title, attributes.duration)
  console.table(commands)
  testAttributes = {
    title: attributes.title,
    duration: attributes.duration,
    commands: Cypress._.cloneDeep(commands),
  }
})

Cypress.on('command:start', (c) => {
  console.log('command start', c.attributes.name)
  commands.push({
    name: c.attributes.name,
    started: +new Date(),
  })
})

Cypress.on('command:end', (c) => {
  console.log('command end', c.attributes.name)
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

  it('deletes an item', () => {
    // reset the backend data using a fixture file
    cy.fixture('todos').then((todos) => {
      cy.request({
        method: 'POST',
        url: '/reset',
        body: {
          todos,
        },
      })
    })

    // spy on the application's XHR calls
    cy.server()
    cy.route('DELETE', '/todos/*').as('delete')

    // load the application
    cy.visit('/')
    cy.get('.todoapp').should('be.visible')

    cy.get('.todo-list li')
    .should('have.length', 2)

    // delete one item and confirm it was deleted
    cy.contains('.todo-list li', 'mock second').find('.destroy').click({ force: true })
    cy.wait('@delete')

    cy.get('.todo-list li')
    .should('have.length', 1)
  })
})
