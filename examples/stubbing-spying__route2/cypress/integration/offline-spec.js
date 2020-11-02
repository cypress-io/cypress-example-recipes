/// <reference types="cypress" />

/* eslint-env browser */

describe('route2', () => {
  // since we are using Chrome debugger protocol API
  // we should only run these tests when NOT in Firefox browser
  context('app', { browser: '!firefox' }, () => {
    // https://caniuse.com/online-status
    const assertOnline = () => {
      return cy.wrap(window).its('navigator.onLine').should('be.true')
    }
    const assertOffline = () => {
      return cy.wrap(window).its('navigator.onLine').should('be.false')
    }

    const goOffline = () => {
      cy.log('**offline**')
      .then(() => {
        return Cypress.automation('remote:debugger:protocol',
          {
            command: 'Network.emulateNetworkConditions',
            params: {
              offline: true,
              latency: -1,
              downloadThroughput: -1,
              uploadThroughput: -1,
            },
          })
      })
    }

    const goOnline = () => {
      // disable offline mode, otherwise we will break our tests :)
      cy.log('**online**')
      .then(() => {
        // https://chromedevtools.github.io/devtools-protocol/1-3/Network/#method-emulateNetworkConditions
        return Cypress.automation('remote:debugger:protocol',
          {
            command: 'Network.emulateNetworkConditions',
            params: {
              offline: false,
              latency: -1,
              downloadThroughput: -1,
              uploadThroughput: -1,
            },
          })
      })
    }

    // make sure we get back online, even if a test fails
    // otherwise the Cypress can lose the browser connection
    beforeEach(goOnline)
    afterEach(goOnline)

    it('shows error message when offline', () => {
      assertOnline()

      const url = 'https://jsonplaceholder.cypress.io/users'

      cy.route2(url).as('users')

      cy.visit('/')

      assertOnline()

      // since this call returns a promise, must tell Cypress to wait
      // for it to be resolved
      goOffline()

      assertOffline()

      // let's spy on the "fetch" method the app calls
      cy.window().then((w) => cy.spy(w, 'fetch').withArgs(`${url}?_limit=3`).as('fetchUsers'))
      cy.get('#load-users').click()

      cy.get('@fetchUsers').should('have.been.calledOnce')

      // the cy.route2 network call does NOT happen
      // because the browser does not fire it
      // and thus our network proxy does not see it
    })
  })
})
