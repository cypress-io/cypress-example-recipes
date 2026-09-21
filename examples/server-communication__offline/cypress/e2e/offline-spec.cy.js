/// <reference types="cypress" />

const url = 'https://jsonplaceholder.cypress.io/users'

// navigator.onLine is a prototype getter, so assignment is ignored and only an
// own property shadows it. https://caniuse.com/online-status
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
    // onBeforeLoad runs before the application scripts, so the first render
    // already sees a disconnected browser
    cy.visit('/', {
      onBeforeLoad: (win) => setOnLine(win, false),
    })

    cy.contains('#network-status', 'offline')
  })

  it('shows an error when the request fails', () => {
    cy.visit('/')
    // a static response suffices while the whole test is offline
    cy.intercept(`${url}*`, { forceNetworkError: true }).as('users')

    goOffline()

    cy.get('#load-users').click()
    cy.wait('@users')
    // the remainder of the message comes from the browser's fetch
    // implementation and differs per browser
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
    // only a handler can fail some requests and pass others as the flag changes
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
    cy.contains('#network-status', 'online')

    cy.get('#load-users').click()
    cy.get('.user').should('have.length', 3)
  })
})
