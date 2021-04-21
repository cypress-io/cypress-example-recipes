// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

/* eslint-disable no-console */
describe('Making requests', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('sets the test cookie', () => {
    cy.getCookie('mycookie')
    .should('deep.include', {
      name: 'mycookie',
      value: 'testcookie',
    })
  })

  it('sends the cookie when using cy.request', () => {
    // https://on.cypress.io/request
    // the endpoint /print-cookies returns the sent cookies
    // back to use so we can validate
    cy.request('/print-cookies')
    .its('body')
    .should('deep.equal', { mycookie: 'testcookie' })
  })

  it('sends additional cookies via cy.request headers', () => {
    // https://on.cypress.io/request
    // can add more headers and cookies
    cy.request({
      url: '/print-cookies',
      headers: {
        'Cookie': 'cookieA=valueA; cookieB=valueB',
      },
    })
    .its('body')
    // the cookies sent to the server are the combination
    // of the cookies set by the page via cy.visit
    // and the cookies we sent via the Cookie header
    .should('deep.equal', {
      mycookie: 'testcookie',
      cookieA: 'valueA',
      cookieB: 'valueB',
    })
  })
})
