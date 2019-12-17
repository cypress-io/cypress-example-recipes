/// <reference types="cypress" />

// see https://github.com/bahmutov/cy-spok
const spok = require('cy-spok')

it('asserts multiple XHR properties at once using cy-spok', () => {
  cy.visit('index.html')

  // before the request goes out we need to set up spying
  // see https://on.cypress.io/network-requests
  cy.server()
  cy.route('POST', '/posts').as('post')

  cy.get('#load').click()
  cy.contains('#output', '"title": "example post"').should('be.visible')

  // Spok https://github.com/thlorenz/spok is a mix between schema and value assertions
  // Since it supports nested objects, in a single "should()" we can verify desired
  // properties of the XHR object, its request and response nested objects.
  cy.get('@post').should(spok({
    status: 201,
    url: spok.endsWith('posts'),
    duration: spok.gt(10), // network request takes at least 10ms
    statusMessage: spok.string,
    // check the request inside XHR object
    request: {
      // using special keyword "$topic" to get
      // nicer indentation in the command log
      $topic: 'request',
      body: {
        title: 'example post',
        userId: 1,
      },
    },
    response: {
      $topic: 'response',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-cache',
      },
      body: {
        title: 'example post',
        body: spok.string,
        userId: 1,
        // we don't know the exact id the server assigns to the new post
        // but it should be > 100
        id: spok.gt(100),
      },
    },
  }))
})
