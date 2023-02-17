/// <reference types="cypress" />
describe('logs in', () => {
  it('using UI', () => {
    cy.visit('/')
    cy.location('pathname').should('equal', '/login')

    // enter valid username and password
    cy.get('[name=username]').type(Cypress.env('username'))
    cy.get('[name=password]').type(Cypress.env('password'))
    cy.contains('button', 'Login').click()

    // confirm we have logged in successfully
    cy.location('pathname').should('equal', '/')
    cy.contains('Hi Test!')
    .should('be.visible')
    .then(() => {
    /* global window */
      const userString = window.localStorage.getItem('user')

      expect(userString).to.be.a('string')
      const user = JSON.parse(userString)

      expect(user).to.be.an('object')
      expect(user).to.have.keys([
        'id',
        'username',
        'firstName',
        'lastName',
        'token',
      ])

      expect(user.token).to.be.a('string')
    })

    // now we can log out
    cy.contains('a', 'Logout').click()
    cy.location('pathname').should('equal', '/login')
  })

  it('fails to access protected resource', () => {
    cy.request({
      url: 'http://localhost:4000/users',
      failOnStatusCode: false,
    })
    .its('status')
    .should('equal', 401)
  })

  it('Does not log in with invalid password', () => {
    cy.visit('/')
    cy.location('pathname').should('equal', '/login')

    // try logging in with invalid password
    cy.get('[name=username]').type('username')
    cy.get('[name=password]').type('wrong-password')
    cy.contains('button', 'Login').click()

    // still on /login page plus an error is displayed
    cy.location('pathname').should('equal', '/login')
    cy.contains('.alert-danger', 'Username or password is incorrect').should(
      'be.visible'
    )
  })
})
