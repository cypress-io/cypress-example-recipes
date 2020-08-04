// by loading custom commands from the support file,
// we also load the global Cypress type definition
/// <reference path="../support/index.d.ts" />

Cypress.Commands.add('asyncAdd', (a, b) => {
  cy.log(`${a} + ${b}`)
  // our application in "index.html" has placed a promise-returning
  // method "asyncAdd" onto the "window" object.
  // from the tests's custom command we can invoke that method
  // Cypress automatically waits for the promises to resolve
  // before yielding their value to the next command in the test
  // https://on.cypress.io/invoke
  cy.window().invoke('asyncAdd', a, b)
})

describe('example', () => {
  it('adds numbers using custom command', () => {
    cy.visit('index.html')
    // the custom command will yield resolved value
    cy.asyncAdd(2, 3).should('equal', 5)
  })
})
