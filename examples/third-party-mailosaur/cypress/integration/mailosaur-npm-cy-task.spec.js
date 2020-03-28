/// <reference types="cypress" />

import { internet } from 'faker'
import { createEmail, deleteAllMessages } from '../support/mailosaur-helper'

describe('tests with Mailosaur npm package and cy.task', function () {
  before('deletes all email messages at Mailosaur', function () {
    deleteAllMessages()
  })

  it('tests sanity with npm Mailosaur package', function () {
    cy.task('checkServerName').should('eq', Cypress.env('MAILOSAUR_SERVERNAME'))
  })

  it('generates a random email address with mailosaur client', function () {
    cy.task('createEmail').should('include', Cypress.env('MAILOSAUR_SERVERID'))
  })

  it('gets email from user, creating the user with helper function', function () {
    const userEmail = createEmail(internet.userName())

    cy.task('sendSimpleEmail', userEmail)
    cy.task('findMessage', userEmail)
  })

  it('gets email from user, using only Mailosaur Node functions', function () {
    cy.task('createEmail').then((userEmail) => {
      cy.task('sendSimpleEmail', userEmail)
      cy.task('findMessage', userEmail)
    })
  })
})
