/// <reference types="cypress" />
describe('Loading single fixture', () => {
  it('loads', () => {
    cy.fixture('city').should('deep.equal', { name: 'Atlanta' })
  })
})
