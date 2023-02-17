// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

/* eslint-disable no-console */

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing
// for now assume it is always something like "cache;desc="my example";dur=2002"
const parseTiming = (singleValue) => {
  const parts = singleValue.split(';')

  return {
    name: parts[0],
    description: parts[1].split('"')[1],
    duration: parseFloat(parts[2].split('=')[1]), // in ms
  }
}

const parseServerTimings = (value) => {
  return value.split(',')
  .map((s) => s.trim())
  .map(parseTiming)
}

const logTiming = (timing) => {
  return cy.log(`**${timing.name}** ${timing.description} ${timing.duration}ms`)
}

describe('Server', () => {
  it('reports timings', function () {
    cy.intercept('/').as('document')
    cy.visit('/')
    cy.wait('@document').its('response.headers.server-timing')
    .then(parseServerTimings)
    .then(console.table)
  })

  it('logs timings', function () {
    cy.intercept('/').as('document')
    cy.visit('/')
    cy.wait('@document').its('response.headers.server-timing')
    .then(parseServerTimings)
    .then((timings) => {
      timings.forEach(logTiming)
    })
  })

  it('reports timings using performance entry', () => {
    cy.visit('/')
    cy.window().its('performance')
    .invoke('getEntriesByType', 'navigation')
    .its('0.serverTiming.0')
    .then(logTiming)

    // we can even assert that the duration is below certain limit
    cy.window().its('performance')
    .invoke('getEntriesByType', 'navigation')
    .its('0.serverTiming')
    .then((timings) => {
      // find the cache timing among all server timings
      return Cypress._.find(timings, { name: 'cache' })
    })
    .then((cacheTiming) => {
      expect(cacheTiming).property('duration').to.be.lessThan(2100)
    })
  })
})
