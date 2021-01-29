/// <reference types="cypress" />

describe('cy.on window:before:load', () => {
  // WORKS
  // beforeEach(() => {
  //   cy.on('window:before:load', (win) => {
  //     win.Analytics = {
  //       sendEvent: cy.stub().as('sendEvent'),
  //     }
  //   })
  // })

  // ALSO WORKS
  // Cypress.on('window:before:load', (win) => {
  //   win.Analytics = {
  //     sendEvent: cy.stub().as('sendEvent'),
  //   }
  // })

  // DOES NOT WORK
  // no error, nothing, but the "cy.get('@sendEvent')" errors later
  cy.on('window:before:load', (win) => {
    console.log('inside cy.on')
    win.Analytics = {
      sendEvent: cy.stub().as('sendEvent'),
    }
  })

  it('sends events', () => {
    cy.visit('index.html')
    cy.get('button#click-me').click().click()
    cy.get('@sendEvent').should('be.calledTwice')
    .invoke('reset') // reset the stub counter

    cy.get('button#click-me').click()
    cy.get('@sendEvent').should('be.calledOnceWithExactly', 'click', 'button#click-me')
  })
})
