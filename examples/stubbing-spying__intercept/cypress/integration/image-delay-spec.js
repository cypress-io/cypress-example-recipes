/// <reference types="Cypress" />
import { checkImageResolution } from './utils'

const checkTigerImageResolution = checkImageResolution(500, 333)

describe('intercept', () => {
  // confirm the cy.intercept does not break binary files
  // NOTE: requires disabled network cache
  // https://github.com/cypress-io/cypress/issues/15038
  it('delays loading of the image', () => {
    cy.intercept({
      pathname: '/images/tiger.jpg',
    }, (req) => {
      req.reply((res) => {
        // .delay in Cypress v6
        // .setDelay in Cypress v7
        res.delay(2000).send()
      })
    }).as('image')

    cy.visit('/pics.html')
    cy.wait('@image')

    cy.get('img[src="images/tiger.jpg"]').should('be.visible')
    .and(checkTigerImageResolution)
  })
})
