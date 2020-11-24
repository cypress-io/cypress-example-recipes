/// <reference types="cypress" />

/* global window */

// use window.navigator.onLine property to determine
// if the browser is offline or online
// https://caniuse.com/online-status
const assertOnline = () => {
  return cy.wrap(window).its('navigator.onLine').should('be.true')
}

const assertOffline = () => {
  return cy.wrap(window).its('navigator.onLine').should('be.false')
}

const goOffline = () => {
  cy.log('**go offline**')
  .then(() => {
    return Cypress.automation('remote:debugger:protocol',
      {
        command: 'Network.enable',
      })
  })
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
  cy.log('**go online**')
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
  .then(() => {
    return Cypress.automation('remote:debugger:protocol',
      {
        command: 'Network.disable',
      })
  })
}

// since we are using Chrome debugger protocol API
// we should only run these tests when NOT in Firefox browser
// see https://on.cypress.io/configuration#Test-Configuration
describe('offline mode', { browser: '!firefox' }, () => {
  // the application is making request to this url
  const url = 'https://jsonplaceholder.cypress.io/users'

  // make sure we get back online, even if a test fails
  // otherwise the Cypress can lose the browser connection
  beforeEach(goOnline)
  afterEach(goOnline)

  it('shows network status', () => {
    cy.visit('/')
    cy.contains('#network-status', 'online')
    .wait(1000) // for demo purpose

    goOffline()
    cy.contains('#network-status', 'offline')
    .wait(1000) // for demo purpose
  })

  it('shows error if we stub the network call', () => {
    assertOnline()
    cy.visit('/')
    cy.intercept(url, { forceNetworkError: true }).as('users')
    cy.get('#load-users').click()
    cy.contains('#users', 'Problem fetching users Failed to fetch')

    // cannot wait for the intercept that forces network error
    // https://github.com/cypress-io/cypress/issues/9062
    // cy.wait('@users', { timeout: 1000 }) // the network call happens
  })

  it('shows error trying to fetch users in offline mode', () => {
    cy.visit('/')
    assertOnline()

    // since this call returns a promise, must tell Cypress to wait
    // for it to be resolved
    goOffline()
    assertOffline()

    cy.get('#load-users').click()
    cy.contains('#users', 'Problem fetching users Failed to fetch')

    // now let's go back online and fetch the users
    goOnline()
    cy.get('#load-users').click()
    cy.get('.user').should('have.length', 3)
  })

  it('makes fetch request when offline', () => {
    cy.visit('/')

    goOffline()
    assertOffline()

    // let's spy on the "fetch" method the app calls
    cy.window().then((w) => cy.spy(w, 'fetch').withArgs(`${url}?_limit=3`).as('fetchUsers'))

    cy.get('#load-users').click()
    cy.get('@fetchUsers').should('have.been.calledOnce')

    // now let's go back online and fetch the users
    goOnline()
    cy.get('#load-users').click()
    cy.get('.user').should('have.length', 3)
    cy.get('@fetchUsers').should('have.been.calledTwice')
  })

  it('does not reach the outside network when offline', () => {
    cy.visit('/')

    // before we go offline we have to set up network intercepts
    // since they need to be communicated outside the browser
    // and lets keep track the number of network calls made
    let callCount = 0

    cy.intercept(url, () => {
      callCount += 1
    }).as('users')

    goOffline()
    assertOffline()

    cy.get('#load-users').click()
    cy.contains('#users', 'Problem fetching users Failed to fetch')

    // the cy.intercept network call does NOT happen
    // because the browser does not fire it
    // and thus our network proxy does not see it
    cy.then(() => {
      expect(callCount, 'no network calls made').to.equal(0)
    })

    // now let's go back online and fetch the users
    goOnline()
    cy.get('#load-users').click()
    // we can retry the assertion to know when the network call has happened
    // using .should callback function with an assertion inside
    .should(() => {
      expect(callCount, 'single network call').to.equal(1)
    })

    cy.wait('@users')
    .its('response.body')
    .should('have.length', 3)

    cy.get('.user').should('have.length', 3)
  })
})
