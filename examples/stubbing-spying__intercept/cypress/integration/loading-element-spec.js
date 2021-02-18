/// <reference types="Cypress" />

describe('intercept', () => {
  it('shows loading element', () => {
    cy.intercept('/favorite-fruits', {
      body: ['Apple', 'Banana', 'Cantaloupe'],
      delay: 1000,
    })

    cy.visit('/fruits.html')
    // see https://glebbahmutov.com/blog/negative-assertions/
    cy.get('.loader').should('be.visible')
    cy.get('.loader').should('not.exist')
  })

  it('shows loading element for as little as possible', () => {
    // see https://blog.dai.codes/cypress-loading-state-tests/
    let sendResponse
    const trigger = new Cypress.Promise((resolve) => {
      // save the resolve method
      // so this promise resolves when we call it
      sendResponse = resolve
    })

    cy.intercept('/favorite-fruits', (req) => {
      // wait for the trigger to be called
      trigger.then(() => req.reply(['Apple', 'Banana', 'Cantaloupe']))
    })

    cy.visit('/fruits.html')
    cy.get('.loader').should('be.visible').then(sendResponse)
    cy.get('.loader').should('not.exist')
  })
})
