/// <reference types="cypress" />

import { userService } from '../../src/_services/user.service'

describe('logs in', () => {
  it('by using application service', () => {
    cy.log('user service login')

    // see https://on.cypress.io/wrap
    // cy.wrap(user promise) forces the test commands to wait until
    // the user promise resolves. We also don't want to log empty "wrap {}"
    // to the command log, since we already logged a good message right above
    cy.wrap(userService.login(Cypress.env('username'), Cypress.env('password')), {
      log: false,
    }).then((user) => {
    // the userService.login resolves with "user" object
    // and we can assert its values inside .then()

      // confirm general shape of the object
      expect(user).to.be.an('object')
      expect(user).to.have.keys([
        'firstName',
        'lastName',
        'username',
        'id',
        'token',
      ])

      // we don't know the token or id, but we know the expected names
      expect(user).to.contain({
        username: 'test',
        firstName: 'Test',
        lastName: 'User',
      })
    })

    // cy.visit command will wait for the promise returned from
    // the "userService.login" to resolve. Then local storage item is set
    // and the visit will immediately be authenticated and logged in
    cy.visit('/')
    // we should be logged in
    cy.contains('Hi Test!').should('be.visible')
  })

  it('can assert against resolved object using .should', () => {
    cy.log('user service login')

    // same login promise
    cy.wrap(userService.login(Cypress.env('username'), Cypress.env('password')), {
      log: false,
    })
    // but resolved value checked using implicit assertions
    // that can be easier to read
    .should('be.an', 'object')
    .and('have.keys', ['firstName', 'lastName', 'username', 'id', 'token'])
    .and('contain', {
      username: 'test',
      firstName: 'Test',
      lastName: 'User',
    })

    // cy.visit command will wait for the promise returned from
    // the "userService.login" to resolve. Then local storage item is set
    // and the visit will immediately be authenticated and logged in
    cy.visit('/')
    // we should be logged in
    cy.contains('Hi Test!').should('be.visible')
  })

  /**
 * Custom command to log in using application method.
 * Commands are automatically waited on, thus we don't need extra "cy.wrap"
 * around the returned promise.
 *
 * @example cy.login()
 */
  Cypress.Commands.add(
    'login',
    (username = Cypress.env('username'), password = Cypress.env('password')) => {
      return userService.login(username, password)
    }
  )

  it('by wrapping application code in custom command', () => {
  // custom commands are automatically chained
    cy.login()
    // thus the visit will not start until the promise returned
    // by the application code inside the custom command "login" resolves
    cy.visit('/')
    cy.contains('Hi Test!').should('be.visible')
  })
})
