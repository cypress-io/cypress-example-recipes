/// <reference types="cypress" />
import { recurse } from 'cypress-recurse'

describe('waits for API', () => {
  beforeEach(() => {
    // this call to the API resets the counter
    // the API endpoint /greeting will be available
    // in a random period between 1 and 5 seconds
    cy.request('POST', '/reset-api')
  })

  it('fails', () => {
    cy.visit('/')
    cy.get('#get-api-response').click()
    cy.contains('#output', 'Not Found').should('be.visible')
  })

  it('fails because the API is not ready', () => {
    cy.visit('/')
    cy.intercept({
      pathname: '/greeting',
    }, {
      body: '',
      statusCode: 404,
    }).as('greeting')

    cy.get('#get-api-response').click()
    cy.contains('#output', 'Not Found').should('be.visible')
    // confirm our intercept was hit
    cy.wait('@greeting')
  })

  it.only('works if we wait up to 5 seconds for the API to be ready', () => {
    cy.visit('/')
    cy.wait(5000)
  })

  it.skip('waits for (mock) API endpoint to start', () => {
    setTimeout(() => {
      cy.intercept('GET', '/greeting', 'Hello')
    }, 1000)

    cy.visit('index.html')
    cy.contains('#output', 'Hello').should('be.visible')
  })
})
