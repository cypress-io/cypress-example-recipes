/// <reference types="cypress" />
import 'cypress-wait-until'
import { plan } from 'cypress-expect-n-assertions'

describe('Window confirm', () => {
  // NOTE: skipping this test because it does not wait correctly for assertion to execute
  it.skip('calls window confirm', () => {
    cy.visit('index.html')
    cy.on('window:confirm', (message) => {
      expect(message).to.equal('Are you sure?')
    })

    cy.get('#click').click()
  })

  it('waits for window confirm to happen using stub', () => {
    cy.visit('index.html')
    cy.on('window:confirm', cy.stub().as('confirm'))

    cy.get('#click').click()
    // test automatically waits for the stub
    cy.get('@confirm').should('have.been.calledWith', 'Are you sure?')
  })

  it('waits for window confirm to happen using variable', () => {
    cy.visit('index.html')
    let called

    cy.on('window:confirm', (message) => {
      expect(message).to.equal('Are you sure?')
      called = true
    })

    cy.get('#click').click()
    // test automatically waits for the variable "called"
    cy.wrap(null).should(() => {
      expect(called).to.be.true
    })
  })

  it('waits for window confirm to happen using promises', () => {
    cy.visit('index.html')
    let calledPromise = new Promise((resolve) => {
      cy.on('window:confirm', (message) => {
        expect(message).to.equal('Are you sure?')
        resolve()
      })
    })

    // test automatically waits for the promise
    cy.get('#click').click().then(() => calledPromise)
  })

  it('waits for window confirm to happen using cy.waitUntil', () => {
    cy.visit('index.html')
    let called

    cy.on('window:confirm', (message) => {
      expect(message).to.equal('Are you sure?')
      called = true
    })

    cy.get('#click').click()
    // see https://github.com/NoriSte/cypress-wait-until
    cy.waitUntil(() => called)
  })

  context('plan', () => {
    it('waits for window confirm to happen using waitUntil', () => {
      plan(1)
      cy.visit('index.html')
      let called

      cy.on('window:confirm', (message) => {
        expect(message).to.equal('Are you sure?')
        called = true
      })

      cy.get('#click').click()
      // see https://github.com/NoriSte/cypress-wait-until
      cy.waitUntil(() => called)
    })

    it('waits for planned number of assertion to run', () => {
      plan(1)
      cy.visit('index.html')

      cy.on('window:confirm', (message) => {
        expect(message).to.equal('Are you sure?')
      })

      cy.get('#click').click()
    })
  })
})
