/// <reference types="cypress" />

import { userService } from '../../src/_services/user.service'

// log in using application code
it('logs in by using application service', () => {
  cy.log('user service login')

  // see https://on.cypress.io/wrap
  // cy.wrap(user promise) forces the test commands to wait until
  // the user promise resolves. We also don't want to log empty "wrap {}"
  // to the command log, since we already logged a good message right above
  cy.wrap(userService.login(Cypress.env('username'), Cypress.env('password')), {
    log: false
  })

  // cy.visit command will wait for the promise returned from
  // the "userService.login" to resolve. Then local storage item is set
  // and the visit will immediately be authenticated and logged in
  cy.visit('/')
  // we should be logged in
  cy.contains('Hi Test!').should('be.visible')
})
