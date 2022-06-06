/// <reference types="cypress" />

describe('cy.on window:before:load', () => {
  // @see https://on.cypress.io/catalog-of-events
  // let's use "window:before:load" to automatically
  // attach mock Analytics method to the application's "window" object
  // we will use "cy.on" which requires a test or a hook to work
  beforeEach(() => {
    cy.on('window:before:load', (win) => {
      win.Analytics = {
        sendEvent: cy.stub().as('sendEvent'),
      }
    })
  })

  it('sends events', () => {
    cy.visit('index.html')
    cy.get('button#click-me').click().click()
    cy.get('@sendEvent').should('be.calledTwice')
    .invoke('reset') // reset the stub counter

    cy.get('button#click-me').click()
    cy.get('@sendEvent').should('be.calledOnceWithExactly', 'click', 'button#click-me')
  })

  it('sends more events', () => {
    cy.visit('index.html')
    cy.get('button#click-me').click()
    // if we do not precise value for one of the arguments
    // we can "skip" it but make sure it is still a string
    // using Sinon matchers
    //
    cy.get('@sendEvent').should('be.calledOnceWith',
      Cypress.sinon.match.string, 'button#click-me')
  })
})
