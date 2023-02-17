/// <reference types="Cypress" />

describe('intercept', { retries: 2 }, () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const N = 10

  Cypress._.times(N, (k) => {
    it(`gets a user ${k + 1} / ${N}`, () => {
      cy.intercept('/users/2').as('secondUser')
      cy.get('#load-second-user').click()
      cy.wait('@secondUser')
    })
  })

  Cypress._.times(N, (k) => {
    it(`posts a user ${k + 1} / ${N}`, () => {
      cy.intercept('POST', '/users').as('postUser')
      cy.get('#post-user').click()
      cy.wait('@postUser').its('response.statusCode').should('equal', 201)
    })
  })
})
