/// <reference types="Cypress" />
/* eslint-disable no-console */
describe('intercept the cached resource', () => {
  // NOTE: only works when the DevTools has network "disable cache" checked
  it.skip('by default does not see request', () => {
    cy.visit('/')
    // intercept the network traffic outside the browser
    cy.intercept({
      pathname: '/cached-user',
    }).as('cachedUser')

    // to confirm the call happens, spy on the fetch method
    cy.window().then((win) => cy.spy(win, 'fetch').as('fetch'))

    cy.get('button#get-cached-user').click()
    cy.get('@fetch').should('have.been.calledOnce')
    cy.wait('@cachedUser')
  })
})
