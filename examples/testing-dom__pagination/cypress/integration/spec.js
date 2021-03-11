// @ts-check
/// <reference types="Cypress" />
import { recurse } from 'cypress-recurse'

describe('pagination', () => {
  it('goes to the last page (using recurse)', () => {
    cy.visit('public/index.html')
    recurse(
      () => cy.get('.paginationjs-next'),
      (next) => next.hasClass('disabled'),
      {
        delay: 1500, // just to make it clear what is going on
        post () {
          cy.get('.paginationjs-next').click()
        },
      }
    )

    cy.contains('li', 11).should('be.visible')
    cy.contains('.paginationjs-nav', '3 / 3').should('be.visible')
    // if you want to confirm the "next" list is disabled
    cy.get('.paginationjs-next').should('have.class', 'disabled')
  })
})
