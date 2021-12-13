/// <reference types="Cypress" />

describe('intercept', () => {
  beforeEach(() => {
    // this solution assumes:
    // - you're only dealing with XHR requests
    // - your app sets the `accept` header to "application/json"

    // stop all other Ajax application/json requests
    // by responding with `404`
    cy.intercept(
      {
        headers: {
          accept: 'application/json',
        },
      },
      {
        statusCode: 404,
      }
    )

    // DO NOT DO THIS:
    // cy.intercept('*', { statusCode: 404 })
    // as it will break all network requests
  })

  it('test', () => {
    cy.intercept({
      method: 'POST',
      pathname: '/users',
    }).as('postUser')

    cy.visit('/')
    // triggers POST /users request and gets real response:
    cy.get('#post-user').click()
    cy.wait('@postUser')
    // triggers PUT /users/1 request but gets stubbed 404 response:
    cy.get('#put-user').click()
  })
})
