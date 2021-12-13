/// <reference types="Cypress" />

describe('intercept', () => {
  it('shows loading element', () => {
    cy.intercept('/favorite-fruits', {
      body: ['Apple', 'Banana', 'Cantaloupe'],
      delay: 1000,
    })

    cy.visit('/fruits.html')
    // see https://glebbahmutov.com/blog/negative-assertions/
    cy.get('.loader').should('be.visible')
    cy.get('.loader').should('not.exist')
  })

  // this test does not work, Cypress has no idea you want to respond
  // and just continues with the real network call to the server
  // NOTE: cannot reply asynchronously using setTimeout
  it.skip('slows the reply using setTimeout', () => {
    cy.intercept('/favorite-fruits', (req) => {
      setTimeout(() => {
        req.reply(['Apple', 'Banana', 'Cantaloupe'])
      }, 1000)
    })

    cy.visit('/fruits.html')
    cy.get('.loader').should('be.visible')
    cy.get('.loader').should('not.exist')
  })

  it('slows the reply by returning a Promise', () => {
    // IMPORTANT: make sure the route handler returns a promise
    // so Cypress knows the handler is still processing
    const fruits = ['Apple', 'Banana', 'Cantaloupe']

    cy.intercept('/favorite-fruits', (req) => {
      // return a promise that waits 1 second
      // and resolves with the list of fruits
      // that response will then be passed to "req.reply(...)"
      // to be returned from the network
      return Cypress.Promise.delay(1000, fruits).then(req.reply)
    })

    cy.visit('/fruits.html')
    cy.get('.loader').should('be.visible')
    cy.get('.loader').should('not.exist')
  })

  it('shows loading element for as little as possible', () => {
    // see https://blog.dai.codes/cypress-loading-state-tests/
    let sendResponse
    const trigger = new Cypress.Promise((resolve) => {
      // save the resolve method
      // so this promise resolves when we call it
      sendResponse = resolve
    })

    cy.intercept('/favorite-fruits', (req) => {
      // wait for the trigger to be called
      return trigger.then(() => req.reply(['Apple', 'Banana', 'Cantaloupe']))
    })

    cy.visit('/fruits.html')
    cy.get('.loader').should('be.visible').then(sendResponse)
    cy.get('.loader').should('not.exist')
  })

  it('shows loading element for as little as possible via Promise.defer', () => {
    // while official Bluebird Promise deferred has been deprecated
    // I don't think it is going away any time soon
    const deferred = Cypress.Promise.defer()

    const fruits = ['Apple', 'Banana', 'Cantaloupe']

    cy.intercept('/favorite-fruits', (req) => {
      return deferred.promise.then(req.reply)
    })

    cy.visit('/fruits.html')
    cy.get('.loader').should('be.visible')
    .then(() => deferred.resolve(fruits))

    cy.get('.loader').should('not.exist')
  })
})
