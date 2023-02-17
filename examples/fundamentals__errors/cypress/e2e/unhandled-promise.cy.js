/// <reference types="cypress" />

/* eslint-disable no-console */
describe('Unhandled promises', () => {
  // NOTE: this test fails in Cypress 7.0+
  it.skip('fail the Cypress test', () => {
    cy.visit('index.html')
    cy.get('button#promise').click()
    // the unhandled promise happens after 1000ms
    cy.wait(1500)
  })

  it('handles the promise rejection', () => {
    // place any caught errors in this object
    const caught = {
      message: null,
    }

    cy.on('uncaught:exception', (e, runnable, promise) => {
      caught.message = e.message

      return false
    })

    cy.visit('index.html')

    cy.get('button#promise').click()
    // waits for the error and confirms the message
    cy.wrap(caught).should((c) => {
      expect(c.message).to.include('Did not handle this promise')
    })
  })
})
