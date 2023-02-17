/// <reference types="cypress" />

// we can access the Cypress.env() object outside the test
const users = Cypress.env('users')

describe('Users from API', () => {
  before(() => {
    // confirm the users data has been set
    expect(users).to.be.an('array').and.to.have.length(3)
  })

  beforeEach(() => {
    cy.visit('index.html')
  })

  users.forEach((user) => {
    it(`has the user ${user.id} ${user.username} ${user.email}`, () => {
      // confirm the user object has the expected keys
      expect(user).to.include.keys(['id', 'username', 'email'])
      // check the page
      cy.contains('td[data-cy=userId]', user.id)
      .parent('tr')
      .within(() => {
        cy.contains('td[data-cy=username]', user.username)
        cy.contains('td[data-cy=email]', user.email)
      })
    })
  })
})
