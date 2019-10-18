/// <reference types="cypress" />
describe('Console', () => {
  describe('spying console.log', function () {
    beforeEach(function () {
      cy.visit('/index.html', {
        onBeforeLoad (win) {
          cy.spy(win.console, 'log').as('consoleLog')
        },
      })
    })

    it('see console log being called with text', function () {
      cy.get('#console-log').click()
      cy.get('@consoleLog').should('be.calledWith', 'Hello World!')
    })
  })

  describe('stubs console.log', function () {
    let parameter

    beforeEach(() => {
      cy.visit('/index.html', {
        onBeforeLoad (win) {
          cy.stub(win.console, 'log', (x) => {
            parameter = x
          })
        },
      })
    })

    it('utilize promise to wait until stub has been executed', function () {
      cy.get('#console-log').click()
      // We need to wait until the application calls "console.log"
      // and our local closure variable "parameter" gets a value.
      // Using "should(cb)" we force retrying the callback
      // until all assertions inside pass, see:
      // https://on.cypress.io/retry-ability
      // https://on.cypress.io/should#Function
      cy.should(() => {
        expect(parameter).to.equal('Hello World!')
      })
    })
  })
})
