/// <reference types="cypress" />
/* global window */
it('works', () => {
  cy.visit('localhost:3000', {
    onBeforeLoad (win) {
      win.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.top.__REACT_DEVTOOLS_GLOBAL_HOOK__
    },
  })
})
