// load the type definition for new command we are adding "cy.dataCy"
// note: this definition also will load regular Cypress definition
// because index.d.ts references global "cypress" types
/// <reference path="../support/index.d.ts" />
// after that the custom commands like "cy.dataCy"
// should be recognized

describe('finds', () => {
  it('element using data-cy custom command', () => {
    cy.visit('index.html')
    // use custom command we have defined above
    cy.dataCy('greeting').should('be.visible')
  })

  it('element using h1', () => {
    cy.visit('index.html')
    // sanity check that h1 element has "data-cy" attribute
    // with expected value
    cy.get('h1')
    .should('be.visible')
    .and('have.attr', 'data-cy', 'greeting')
  })

  it('dynamically added element', () => {
    cy.visit('index.html')
    // another custom command, this one comes from external module
    // load https://github.com/NoriSte/cypress-wait-until
    cy.waitUntil(() => {
      return cy
      .window()
      .then((win) => Boolean(win.document.querySelector('[data-cy=dynamic]')))
    })
  })
})
