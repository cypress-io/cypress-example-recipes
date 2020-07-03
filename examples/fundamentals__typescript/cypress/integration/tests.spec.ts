/* global window */
/// <reference path="../types.d.ts" />

describe('tests', () => {
  it('test custom command', () => {
    cy.visit('cypress/fixtures/test.html')
    cy.clickLink('click me')
  })

  it('test extending AUTWindow', () => {
    // Test Runner window object doesn't have add() function.
    // So, it should fail the type check.
    // @ts-expect-error
    window.add = (a, b) => a + b

    cy.window().then((win) => {
      // AUT add() is defined in the fixture, test.html.
      // So, it should pass the type check.
      return win.add(2, 3)
    })
  })
})
