/// <reference types="cypress" />
/* eslint-disable mocha/no-global-tests */
describe('select2', () => {
  it('selects Massachusetts', () => {
    cy.visit('index.html')

    cy.log('--- Force select ---')
    // https://on.cypress.io/select
    cy.get('#favorite-state').select('MA', { force: true })

    // confirm the value of the selected element
    cy.get('#favorite-state').should('have.value', 'MA')

    // confirm Select2 widget renders the state name
    cy.get('#select2-favorite-state-container').should('have.text', 'Massachusetts')
  })

  it('selects Massachusetts by typing', () => {
    cy.visit('index.html')

    cy.log('--- Pick state by typing ---')
    cy.get('#favorite-state + .select2').click()
    cy.get('input[aria-controls="select2-favorite-state-results"]').type('Mass{enter}')

    // confirm the value of the selected element
    cy.get('#favorite-state').should('have.value', 'MA')

    // confirm Select2 widget renders the state name
    cy.get('#select2-favorite-state-container').should('have.text', 'Massachusetts')
  })
})
