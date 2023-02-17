/// <reference types="Cypress" />

describe('intercept', () => {
  it('returns different fruits every 30 seconds', () => {
    cy.clock()

    // return difference responses on each call
    // notice the order of the intercepts
    cy.intercept('/favorite-fruits', ['kiwi 🥝']) // 3rd, 4th, etc
    cy.intercept('/favorite-fruits', { times: 1 }, ['grapes 🍇']) // 2nd
    cy.intercept('/favorite-fruits', { times: 1 }, ['apples 🍎']) // 1st

    cy.visit('/fruits.html')
    cy.contains('apples 🍎')
    cy.tick(30000)
    cy.contains('grapes 🍇')
    // after using the first two intercepts
    // forever reply with "kiwi" stub
    cy.tick(30000)
    cy.contains('kiwi 🥝')
    cy.tick(30000)
    cy.contains('kiwi 🥝')
    cy.tick(30000)
    cy.contains('kiwi 🥝')
  })
})
