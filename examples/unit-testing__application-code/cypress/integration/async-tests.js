/// <reference types="cypress" />

// these are promise-returning / async functions
import { reverseString, twice } from '../../async-methods'

describe('Async reverse', () => {
  it('reverses a string', () => {
    // important: you need to return the promise from the test
    // to let the test runner know when the test has finished
    // otherwise the test will finish, but then the assertion will suddenly
    // run - and even if the assertion fails, the test has completed already
    return reverseString('foo').then((result) => {
      expect(result).to.equal('oof')
    })
  })

  it('reverses a string with await', async () => {
    // alternatively you can use "async / await" in these unit tests
    // to deal with promises
    const result = await reverseString('bar')

    expect(result).to.equal('rab')
  })

  it('reverses text loaded from a fixture file', () => {
    // when you use Cypress commands like "cy.fixture" the test
    // becomes asynchronous automatically. Cypress waits for all
    // commands to finish, so you don't need to return a promise
    // from the test itself
    cy.fixture('string.txt', 'utf8')
    .then(Cypress._.trim)
    // if you call your Promise-returning functions
    // cy.then automatically waits for the promise to resolve
    // https://on.cypress.io/then
    .then(reverseString)
    .should('equal', 'xof nworb')
  })
})

describe('Async twice', () => {
  it('doubles numbers', () => {
    return twice(2).then((result) => expect(result).to.equal(4))
  })

  it('repeats a string', () => {
    // if we start using Cypress commands, the test becomes asynchronous
    // and will wait for all commands in the chain to finish
    // before the test finishes
    // https://on.cypress.io/wrap
    cy.wrap('fox')
    .then(twice).then(twice)
    .should('equal', 'foxfoxfoxfox')
  })

  it('waits for wrapped promise', () => {
    // if you have promise-returning function
    // (async functions are just a sugar, they return a promise too!)
    // wrap it so Cypress waits for their automatically
    // https://on.cypress.io/wrap
    cy.wrap(twice('async')).should('equal', 'asyncasync')
    // another wrap - the function is called _immediately_
    // but Cypress will process it AFTER the first "cy.wrap"
    cy.wrap(twice('await')).should('equal', 'awaitawait')

    // if you want start the second promise AFTER the first one finishes
    // use https://on.cypress.io/then
    cy.wrap(twice('first'))
    .should('equal', 'firstfirst')
    .then(() => twice('second'))
    .should('equal', 'secondsecond')
  })
})
