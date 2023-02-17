/// <reference types="cypress" />

describe('dayjs example', () => {
  it('uses dayjs set in the support file', () => {
    cy.visit('index.html')
    // dayjs was set in Cypress object in the support file
    const todaysDate = Cypress.dayjs().format('MMM DD, YYYY')

    cy.contains('span', `Order shipped on: ${todaysDate}`)
  })
})
