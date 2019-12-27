/// <reference types="cypress" />
/* global window */
it('loads React DevTools extension', () => {
  cy.visit('localhost:3000', {
    onBeforeLoad (win) {
      // this lets React DevTools "see" components inside application's iframe
      win.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.top.__REACT_DEVTOOLS_GLOBAL_HOOK__
    },
  })
  // ? how do we confirm this is working?
})
