/// <reference types="Cypress" />

describe('intercept', () => {
  context('counting network calls (spy)', () => {
    it('fetches every 30 seconds', () => {
      cy.clock()
      // create a cy.spy() that will be called
      // by the intercept. we later can use that spy
      // to check the number of times it was called
      cy.intercept('/favorite-fruits', cy.spy().as('reqForFruits'))

      cy.visit('/fruits.html')
      cy.get('@reqForFruits').should('have.been.calledOnce')

      // application fetches fruits again 30 seconds later
      cy.tick(30000)
      cy.get('@reqForFruits').should('have.been.calledTwice')

      cy.tick(30000)
      cy.get('@reqForFruits').should('have.been.calledThrice')

      cy.tick(30000)
      // after that we should retrieve the call count property
      cy.get('@reqForFruits').its('callCount').should('equal', 4)
    })
  })

  context('counting network calls (stub)', () => {
    it('fetches every 30 seconds', () => {
      cy.clock()
      // prepare a stub function we can call to "count" intercepts
      const replyStub = cy.stub().as('stubFruits')

      // cy.intercept replying with a pre-defined response
      // expects the route handler in the form
      //   (req) => req.reply(...)
      cy.intercept('/favorite-fruits', (req) => {
        replyStub(req) // remember the request for example
        req.reply({ fixture: 'fruits.json' })
      })

      cy.visit('/fruits.html')
      cy.get('@stubFruits').should('have.been.calledOnce')

      // application fetches fruits again 30 seconds later
      cy.tick(30000)
      cy.get('@stubFruits').should('have.been.calledTwice')

      cy.tick(30000)
      cy.get('@stubFruits').should('have.been.calledThrice')

      cy.tick(30000)
      // after that we should retrieve the call count property
      cy.get('@stubFruits').its('callCount').should('equal', 4)
    })

    it('fetches every 30 seconds (stub.callsFake)', () => {
      cy.clock()
      cy.intercept('/favorite-fruits',
        cy.stub()
        .callsFake((req) => req.reply({ fixture: 'fruits.json' }))
        .as('stubFruits'))

      cy.visit('/fruits.html')
      cy.get('@stubFruits').should('have.been.calledOnce')

      // application fetches fruits again 30 seconds later
      cy.tick(30000)
      cy.get('@stubFruits').should('have.been.calledTwice')

      cy.tick(30000)
      cy.get('@stubFruits').should('have.been.calledThrice')

      cy.tick(30000)
      // after that we should retrieve the call count property
      cy.get('@stubFruits').its('callCount').should('equal', 4)
    })
  })
})
