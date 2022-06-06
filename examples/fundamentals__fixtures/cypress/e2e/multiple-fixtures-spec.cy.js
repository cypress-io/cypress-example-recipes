/// <reference types="cypress" />
/* eslint-disable no-console */

describe('Loading multiple fixtures', () => {
  it('loads fixtures one by one', () => {
    // pyramid of doom of fixtures
    cy.fixture('city').then((city) => {
      cy.fixture('country').then((country) => {
        // thanks to JavaScript closures we have access to both fixtures
        expect({ city, country }).to.deep.equal({
          city: { name: 'Atlanta' },
          country: { name: 'United States' },
        })
      })
    })
  })

  // NOTE: test showing possible race condition
  it.skip('loads fixtures using Cypress.Promise.all - not recommended due to race condition', () => {
    // see discussion of Cypress.Promise.all in
    // https://github.com/cypress-io/cypress/issues/2932
    // not recommended because potentially is a non-deterministic race between commands
    Cypress.Promise.all([cy.fixture('city'), cy.fixture('country')]).spread(
      (city, country) => {
        // currently in Cypress v3 returns _the second_ fixture for both "city" and "country"
        console.log('city is', city)
        console.log('country is', country)
        expect(city).to.deep.equal({ name: 'Atlanta' })
        expect(country).to.deep.equal({ name: 'United States' })
      }
    )
  })
})
