/// <reference types="cypress" />
const add = (a, b) => a + b

describe('functions', () => {
  it('adds numbers', () => {
    cy.wrap(add(2, 3)).snapshot()
    cy.wrap(add(1, 10)).snapshot()
    cy.wrap(add(-6, -3)).snapshot({ name: 'negatives' })
  })

  it('converts string to lowercase', function () {
    cy.wrap('My STRING')
    .invoke('toLowerCase')
    .snapshot({
      name: 'lowercase string',
    })
  })
})
