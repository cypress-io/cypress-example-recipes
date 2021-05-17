/// <reference types="cypress" />

describe('offline/online mode', () => {
  // the application is making request to this url
  const url = 'https://jsonplaceholder.cypress.io/users'

  context('when online', () => {
    beforeEach(() => {
      cy.visit('/', {
        onBeforeLoad(win) {
          // use window.navigator.onLine property to
          // mock browser is offline or online
          // https://caniuse.com/online-status
          cy.stub(win.navigator, 'onLine', true).as('online')
        }
      })
      cy.intercept('*').as('users')

      cy.wrap(window).its('navigator.onLine').should('be.true')
    })

    it('shows network status as online', () => {
      cy.contains('#network-status', 'online')
    })
  
    it('fetches users', () => {
      // let's spy on the "fetch" method the app calls
      cy.window().then((w) => cy.spy(w, 'fetch').withArgs(`${url}?_limit=3`).as('fetchUsers'))
      cy.get('#load-users').click()
      cy.get('.user').should('have.length', 3)
      cy.get('@fetchUsers').should('have.been.calledOnce')
    })
  })

  context('when offline', () => {
    beforeEach(() => {
      cy.visit('/', {
        onBeforeLoad(win) {
          cy.stub(win.navigator, 'onLine', false).as('online')
        }
      })
      cy.intercept('*', { forceNetworkError: true }).as('users')
    })

    it('shows network status as offline', () => {
      cy.contains('#network-status', 'offline')
    })

    it('shows error if we stub the network call', () => {
      cy.get('#load-users').click()
      cy.contains('#users', 'Problem fetching users')

      cy.wait('@users') // the network call happens
    })

    it('shows error trying to fetch users in offline mode', () => {
      cy.get('#load-users').click()
      cy.contains('#users', 'Problem fetching users')
    })

    it('makes fetch request when offline', () => {
      // let's spy on the "fetch" method the app calls
      cy.window().then((w) => cy.spy(w, 'fetch').withArgs(`${url}?_limit=3`).as('fetchUsers'))

      cy.get('#load-users').click()
      cy.get('@fetchUsers').should('have.been.calledOnce')
    })

    it('does not reach the outside network when offline', () => {
      let callCount = 0

      cy.intercept('*', { forceNetworkError: true }, () => {
        callCount += 1
      }).as('users')

      cy.get('#load-users').click()
      cy.contains('#users', 'Problem fetching users')

      // the cy.intercept network call does NOT happen
      // because the browser does not fire it
      // and thus our network proxy does not see it
      cy.then(() => {
        expect(callCount, 'no network calls made').to.equal(0)
      })
    })
  })
})
