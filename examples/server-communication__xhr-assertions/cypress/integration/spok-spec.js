/// <reference types="cypress" />

// see https://github.com/bahmutov/cy-spok
const spok = require('cy-spok')

describe('network', () => {
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
      // network request takes at least 10ms
      // but should finish in less than 3 seconds on CI
      duration: spok.range(10, 3500),
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

  // there is a bug in Cypress with chaining multiple assertion callbacks
  // like .should(cb1).should(cb2)
  // https://github.com/cypress-io/cypress/issues/4981
  // but we can use multiple callbacks by chaining .then(cb1).then(cb2)
  // which works fine since our request object cannot change
  it('can chain assertions using .then', () => {
    cy.visit('index.html')

    cy.server()
    cy.route('POST', '/posts').as('post')

    cy.get('#delayed-load').click()
    // the request has gone out - let's wait for it
    // and then assert some of its properties
    cy.wait('@post').then(spok({
      status: 201,
    }))
    // let's confirm the request object
    .its('request.body')
    // notice that we want to confirm that the "body" field is a string
    // and it starts with certain prefix. Since we cannot AND conditions
    // we can split checks across 2 spoks
    .then(spok({
      title: 'example post',
      userId: 1,
      body: spok.string,
    }))
    // cy.then(cb) yields its original subject
    // thus the second .then(cb) can work with the same request
    // https://on.cypress.io/then
    .then(spok({
      body: spok.startsWith('this is a post'),
    }))

    // cy.its(...) yields the property value
    // so if we want to validate the response object
    // we need to get the XHR object again
    // by now the object exists, thus we can use cy.get()
    cy.get('@post').its('response').should(spok({
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
    }))
  })
})
