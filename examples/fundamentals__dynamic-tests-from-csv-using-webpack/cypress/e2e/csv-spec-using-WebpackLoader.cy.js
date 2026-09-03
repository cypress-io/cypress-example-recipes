/// <reference types="cypress" />

describe('Users from CSV', () => {
  const csvUsers = require('../fixtures/users.csv')

  beforeEach(() => {
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
