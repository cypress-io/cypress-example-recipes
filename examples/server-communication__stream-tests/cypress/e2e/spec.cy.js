/// <reference types="cypress" />
const pkg = require('../../package.json')

describe(pkg.name, () => {
  it('first test', () => {
    cy.wait(1000)
  })

  it('second test', () => {
    cy.wait(1000)
  })

  it('third test', () => {
    cy.wait(1000)
  })
})
