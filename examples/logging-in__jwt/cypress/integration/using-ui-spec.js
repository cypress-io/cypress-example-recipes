/// <reference types="cypress" />
it('Logs in using UI', () => {
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
