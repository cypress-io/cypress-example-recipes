/// <reference types="cypress" />
describe('generated from a list', () => {
  const operations = [
    {
      op: '2 + 2',
      value: 4,
    },
    {
      op: '10 - 15',
      value: -5,
    },
    {
      op: '3 * 17',
      value: 51,
    },
  ]

  // dynamically create a single test for each operation in the list
  operations.forEach((operation) => {
    // derive test name from data
    it(`computes ${operation.op} = ${operation.value}`, () => {
      cy.wrap(eval(operation.op)).should('equal', operation.value)
    })
  })
})
