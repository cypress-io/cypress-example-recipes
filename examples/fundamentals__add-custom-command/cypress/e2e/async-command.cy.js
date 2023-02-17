// by loading custom commands from the support file,
// we also load the global Cypress type definition
/// <reference path="../support/index.d.ts" />

Cypress.Commands.add('asyncAdd', (a, b) => {
  cy.log(`${a} + ${b}`)

  // After 1000 ms, our application's index.html adds a promise-returning
  // method "asyncAdd" onto the "window" object.
  // .its() waits for this to exist before passing it to .then().

  // .then() in turn automatically waits for the returned promise to resolve
  // before yielding its value to the next command in the test
  // https://on.cypress.io/then
  cy.window().its('asyncAdd').then((add) => add(a, b))
})

describe('example', () => {
  it('adds numbers using custom command', () => {
    cy.visit('index.html')
    // the custom command will yield resolved value
    cy.asyncAdd(2, 3).should('equal', 5)
  })
})
