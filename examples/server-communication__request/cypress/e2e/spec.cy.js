// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

/* global fetch */
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

  it('fetch makes request with page cookies', () => {
    // by wrapping the Promise returned by the "fetch" function
    // we place it into the Cypress command chain
    cy.wrap(fetch('/print-cookies'))
    // to get the JSON from the response object
    // need to call res.json()
    // NOTE: do not use cy.invoke as it can be retried
    // and the response cannot have res.json() called more than once
    .then((r) => r.json())
    .should('deep.equal', {
      mycookie: 'testcookie',
    })
  })

  it('fetch without page cookies', () => {
    cy.wrap(fetch('/print-cookies', { credentials: 'omit' }))
    .then((r) => r.json())
    // no cookies were sent with the fetch request
    .should('deep.equal', {})
  })

  it('request from Node', () => {
    // makes HTTP request using the "got" module
    // https://github.com/sindresorhus/got#api
    cy.task('httpRequest', {
      url: `${Cypress.config('baseUrl')}/print-cookies`,
      headers: {
        'Cookie': 'cookieA=valueA; cookieB=valueB',
      },
      responseType: 'json',
    })
    // only the explicit cookies are included
    // in the request, no page cookies
    .should('deep.equal', {
      cookieA: 'valueA',
      cookieB: 'valueB',
    })
  })
})
