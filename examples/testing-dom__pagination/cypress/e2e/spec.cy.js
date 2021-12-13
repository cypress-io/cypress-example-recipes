// @ts-check
/// <reference types="Cypress" />
import { recurse } from 'cypress-recurse'

describe('pagination', () => {
  // iterate recursively until the "Next" link is disabled
  // then assert we are on the last page
  it('goes to the last page', () => {
    cy.visit('public/index.html')

    const visitTextPageIfPossible = () => {
      cy.get('.paginationjs-next').then(($next) => {
        if ($next.hasClass('disabled')) {
          // we are done - we are on the last page
          return
        }

        cy.wait(500) // just for clarity
        cy.get('.paginationjs-next').click()
        visitTextPageIfPossible()
      })
    }

    visitTextPageIfPossible()

    cy.log('**on the last page**')
    cy.contains('li', 11).should('be.visible')
    cy.contains('.paginationjs-nav', '3 / 3').should('be.visible')
    // if you want to confirm the "next" list is disabled
    cy.get('.paginationjs-next').should('have.class', 'disabled')
  })

  it('goes to the last page (using recurse)', () => {
    cy.visit('public/index.html')

    // cypress-recurse has built-in options for
    // iterating until the predicate returns true
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

    cy.log('**on the last page**')
    cy.contains('li', 11).should('be.visible')
    cy.contains('.paginationjs-nav', '3 / 3').should('be.visible')
    // if you want to confirm the "next" list is disabled
    cy.get('.paginationjs-next').should('have.class', 'disabled')
  })
})
