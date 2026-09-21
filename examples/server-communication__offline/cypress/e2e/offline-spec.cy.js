/// <reference types="cypress" />

// Taking the browser offline for real, through the Chrome Debugger Protocol's
// Network.emulateNetworkConditions, also severs the WebSocket the Cypress
// runner needs, which hangs the run from Chromium 97 onward.
// https://github.com/cypress-io/cypress-example-recipes/issues/772
//
// So this spec simulates the two things the application itself observes:
// its view of connectivity (navigator.onLine plus the online/offline events)
// and its requests failing (cy.intercept). Neither touches the browser's real
// network stack, so these tests run in every browser Cypress supports.

const url = 'https://jsonplaceholder.cypress.io/users'

// navigator.onLine is a getter on Navigator.prototype, and an own property
// defined on the instance shadows it. https://caniuse.com/online-status
const setOnLine = (win, online) => {
  Object.defineProperty(win.navigator, 'onLine', {
    configurable: true,
    get: () => online,
  })
}

const goOffline = () => {
  cy.log('**go offline**')

  return cy.window().then((win) => {
    setOnLine(win, false)
    win.dispatchEvent(new win.Event('offline'))
  })
}

const goOnline = () => {
  cy.log('**go online**')

  return cy.window().then((win) => {
    setOnLine(win, true)
    win.dispatchEvent(new win.Event('online'))
  })
}

const assertOnline = () => cy.window().its('navigator.onLine').should('be.true')

const assertOffline = () => cy.window().its('navigator.onLine').should('be.false')

describe('offline mode', () => {
  it('shows the network status', () => {
    cy.visit('/')
    cy.contains('#network-status', 'online')

    goOffline()
    cy.contains('#network-status', 'offline')

    goOnline()
    cy.contains('#network-status', 'online')
  })

  it('renders as offline when the page loads without a connection', () => {
    // onBeforeLoad runs before the application's own scripts, so its very
    // first render already sees a disconnected browser
    cy.visit('/', {
      onBeforeLoad: (win) => setOnLine(win, false),
    })

    assertOffline()
    cy.contains('#network-status', 'offline')
  })

  it('shows an error when the request fails', () => {
    cy.visit('/')
    // when a whole test is offline, a static forceNetworkError is enough
    cy.intercept(`${url}*`, { forceNetworkError: true }).as('users')

    goOffline()
    assertOffline()

    cy.get('#load-users').click()
    cy.wait('@users')
    // the rest of the message comes from the browser's own fetch
    // implementation and differs between browsers, so assert only on the
    // part the application controls
    cy.contains('#users', 'Problem fetching users')
  })

  it('still attempts the fetch while offline', () => {
    cy.visit('/')
    cy.intercept(`${url}*`, { forceNetworkError: true })

    goOffline()

    cy.window().then((win) => {
      cy.spy(win, 'fetch').withArgs(`${url}?_limit=3`).as('fetchUsers')
    })

    cy.get('#load-users').click()
    cy.get('@fetchUsers').should('have.been.calledOnce')
    cy.contains('#users', 'Problem fetching users')
  })

  it('recovers when the network comes back', () => {
    // to flip connectivity inside a single test, let one route handler decide
    // each request's fate rather than stubbing a static network error
    let offline = false

    cy.intercept(`${url}*`, (req) => {
      if (offline) {
        req.destroy()
      }
    })

    cy.visit('/')

    cy.then(() => {
      offline = true
    })

    goOffline()
    cy.get('#load-users').click()
    cy.contains('#users', 'Problem fetching users')

    cy.then(() => {
      offline = false
    })

    goOnline()
    assertOnline()

    // assert on what the application renders rather than waiting on the route:
    // how many interceptions a destroyed request produces is up to the browser,
    // so counting them makes the test browser-specific
    cy.get('#load-users').click()
    cy.get('.user').should('have.length', 3)
  })
})
