/// <reference types="Cypress" />

beforeEach(() => {
  cy.visit('/')
})

it('confirms the number of times an intercept was called', () => {
  cy.intercept('/users?_limit=3').as('users3')
  cy.intercept('/users?_limit=5').as('users5')

  cy.get('#load-users').click().click()
  cy.wait('@users3')

  // to avoid clicking too quickly, add small pauses
  cy.get('#load-five-users').click()
  .wait(20).click()
  .wait(20).click()
  .wait(20).click()
})

it('spies using query parameter', () => {
  cy.intercept({
    pathname: '/users',
    query: {
      _limit: '3',
    },
  }).as('users3')

  cy.intercept({
    pathname: '/users',
    query: {
      _limit: '5',
    },
  }).as('users5')

  cy.get('#load-users').click()
  cy.wait('@users3')

  cy.get('#load-five-users').click()
  cy.wait('@users5')
})
