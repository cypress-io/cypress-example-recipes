/* global window */
/// <reference path="../types.d.ts" />

// @ts-expect-error
window.add(2, 3)

describe('tests', () => {
  it('test custom command', () => {
    cy.visit('https://cypress.io')
    cy.clickLink('get started')
  })

  it('test extending AUTWindow', () => {
    cy.window().then((win) => {
      return win.add(2, 3)
    })
  })
})
