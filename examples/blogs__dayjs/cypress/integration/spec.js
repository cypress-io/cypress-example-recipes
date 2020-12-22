/// <reference types="cypress" />
// import dayjs in a single spec that needs it
const dayjs = require('dayjs')

describe('dayjs example', () => {
  it('has the current date', () => {
    cy.visit('index.html')
    const todaysDate = dayjs().format('MMM DD, YYYY')

    cy.contains('span', `Order shipped on: ${todaysDate}`)
  })
})
