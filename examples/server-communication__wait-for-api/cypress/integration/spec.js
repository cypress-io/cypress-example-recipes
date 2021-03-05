/// <reference types="cypress" />
import { recurse } from 'cypress-recurse'

it('fails because the API is not ready', () => {
  cy.visit('/')
  cy.intercept({
    pathname: '/greeting',
  },
  {
    forceNetworkError: true,
  }).as('greeting')

  cy.get('#get-api-response').click()
})

it('fails because the API is not ready (with log)', () => {
  cy.visit('/')
  cy.intercept({
    pathname: '/greeting',
  },
  (req) => {
    console.log('in the greeting intercept')
    console.log(JSON.stringify(req))
    req.reply({ forceNetworkError: true })
  })

  cy.get('#get-api-response').click()
})
