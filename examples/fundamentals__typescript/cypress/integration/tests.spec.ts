/* global window */
/// <reference path="../types.d.ts" />

before(() => {
  // @ts-expect-error
  window.add = (a, b) => a + b
})

describe('tests', () => {
  it('test custom command', () => {
    cy.visit('cypress/fixtures/test.html')
    cy.clickLink('click me')
  })

  it('test extending AUTWindow', () => {
    cy.window().then((win) => {
      win.add = (a, b) => a + b

      return win.add(2, 3)
    })
  })
})
