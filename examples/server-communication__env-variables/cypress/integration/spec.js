/// <reference types="cypress" />
// https://on.cypress.io/environment-variables
describe('process environment variables', () => {
  it('has variable my-var from cypress.json', () => {
    expect(Cypress.env('my-var')).to.equal('ok')
  })

  it('has variables FOO and BAR from process.env', () => {
    // FOO=42 BAR=baz cypress open
    // see how FOO and BAR were copied in "cypress/plugins/index.js"
    expect(Cypress.env()).to.contain({
      FOO: '42',
      BAR: 'baz',
    })
  })

  it('has renamed variable "ping" from "CYPRESS_ping"', () => {
    // CYPRESS_ping=123 cypress open
    // NOTE passed variable is a number
    expect(Cypress.env('ping')).to.equal(123)
  })

  it('removes CYPRESS_ and cypress_ prefixes', () => {
    cy.wrap(Cypress.env())
    .should('include', {
      'my-var': 'ok',
      ping: 123,
      HOST: 'laura.dev.local',
      api_server: 'http://localhost:8888/api/v1/',
    })
  })
})
