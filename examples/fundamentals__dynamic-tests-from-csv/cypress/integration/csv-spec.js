/// <reference types="cypress" />

// we can access the Cypress.env() object outside the test
const csvUsers = Cypress.env('usersList')

describe('Users from CSV', () => {
  before(() => {
    cy.visit('index.html')
  })

  csvUsers.forEach((user) => {
    it(`has the user ${user['first name']} ${user['last name']}`, () => {
      cy.contains('td[data-cy=userId]', user['user id'])
      .parent('tr')
      .within(() => {
        cy.contains('td[data-cy=firstName]', user['first name'])
        cy.contains('td[data-cy=lastName]', user['last name'])
      })
    })
  })
})
