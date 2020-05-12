/// <reference types="Cypress" />

Cypress.on('test:after:run', (attributes) => {
  /* eslint-disable-next-line no-console */
  console.log('Test "%s" has finished in %dms', attributes.title, attributes.duration)
})

describe('speed', () => {
  it('loads the app', () => {
    cy.request({
      method: 'POST',
      url: '/reset',
      body: {
        todos: [],
      },
    })

    cy.visit('/')
    cy.get('.todoapp').should('be.visible')

    cy.get('.new-todo')
    .type('learn testing{enter}')
    .type('be cool{enter}')

    cy.get('.todo-list li')
    .should('have.length', 2)

    cy.server()
    cy.route('DELETE', '/todos/*').as('delete')
    cy.contains('.todo-list li', 'be cool').find('.destroy').click({ force: true })
    cy.wait('@delete')
  })
})
