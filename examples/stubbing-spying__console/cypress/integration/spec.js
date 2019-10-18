/// <reference types="cypress" />
context('Console', () => {
  describe('spying on console.log', function () {
    beforeEach(function () {
      cy.visit('/index.html', {
        onBeforeLoad (win) {
          cy.spy(win.console, 'log').as('consoleLog')
        },
      })
    })

    it('calls console.log with expected text', function () {
      cy.get('#console-log').click()
      cy.get('@consoleLog').should('be.calledWith', 'Hello World!')
    })
  })

  describe('stubbing console.log', function () {
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

    it('waits until stub has been executed and we get a value', function () {
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
