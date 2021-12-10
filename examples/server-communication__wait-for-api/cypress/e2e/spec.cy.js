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
    // spy on the application's call to make sure it returns 404
    cy.intercept({
      pathname: '/greeting',
    }).as('greeting')

    cy.get('#get-api-response').click()
    cy.contains('#output', 'Not Found').should('be.visible')
    // confirm our intercept was hit
    cy.wait('@greeting').its('response.statusCode').should('equal', 404)
  })

  // slow because of hard-coded maximum wait
  it('works if we wait up to 5 seconds for the API to be ready', () => {
    cy.visit('/')
    cy.wait(5000)

    cy.get('#get-api-response').click()
    cy.contains('#output', 'Hello!').should('be.visible')
  })

  it('checks API until it responds', () => {
    // let's write our own function that checks the API using cy.request
    // if the API responds, we are done
    // otherwise, wait half a second and try again
    const checkApi = () => {
      cy.request({
        url: '/greeting',
        failOnStatusCode: false,
      }).its('isOkStatusCode', { log: false }).then((ok) => {
        if (ok) {
          cy.log('API is ready')

          return
        }

        cy.wait(500, { log: false })
        checkApi()
      })
    }

    cy.visit('/')
    checkApi()
    // now the API is ready and we can use the GUI
    cy.get('#get-api-response').click()
    cy.contains('#output', 'Hello!').should('be.visible')
  })

  it('checks API using cypress-recurse', () => {
    cy.visit('/')
    // useful utility for retrying multiple Cypress commands
    // until the predicate function returns true
    // https://github.com/bahmutov/cypress-recurse
    recurse(
      () => {
        return cy.request({
          url: '/greeting',
          failOnStatusCode: false,
        })
      },
      (res) => res.isOkStatusCode,
      {
        timeout: 6000, // check API for up to 6 seconds
        delay: 500, // half second pauses between retries
        log: false, // do not log details
      }
    )

    // now the API is ready and we can use the GUI
    cy.get('#get-api-response').click()
    cy.contains('#output', 'Hello!').should('be.visible')
  })
})
