/// <reference types="Cypress" />
// <a ping="..."> syntax is behind a flag in Firefox
// https://caniuse.com/?search=anchor%20ping
// Thus make sure to enable it in the plugin file via the browser launch options
describe('intercept', () => {
  it('stubs anchor ping', () => {
    cy.visit('/')
    cy.intercept({
      method: 'POST',
      pathname: '/track',
    }, {}).as('ping')

    cy.get('a[ping]').click()
    cy.location('pathname').should('equal', '/page2.html')
    cy.wait('@ping').its('request.headers').should('deep.include', {
      'ping-from': 'http://localhost:7080/',
      'ping-to': 'http://localhost:7080/page2.html',
    })
  })
})
