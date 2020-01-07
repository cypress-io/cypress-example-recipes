/// <reference types="cypress" />
describe('React DevTools', () => {
  it('loads React DevTools extension', () => {
    cy.visit('localhost:3000')
    // ? how do we confirm this is working?
    cy.get('.board-row').eq(0).find('.square').eq(0).click()
    cy.get('.board-row').eq(0).find('.square').eq(1).click()
  })
})
