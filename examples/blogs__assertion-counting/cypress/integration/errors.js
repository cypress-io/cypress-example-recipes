/// <reference types="cypress" />

/* eslint-disable no-console */
describe('Unhandled promises', () => {
  it('fails Cypress test', () => {
    cy.visit('http://localhost:8066')
    cy.get('button#promise').click()
    // the unhandled promise happens after 1000ms
    cy.wait(1500)
  })

  afterEach(() => {
    console.log('afterEach')
  })
})
