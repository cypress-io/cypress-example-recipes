/// <reference types="Cypress" />
import { checkImageResolution } from './utils'

const checkTigerImageResolution = checkImageResolution(500, 333)

describe('intercept', () => {
  let tigerImageSizeBytes

  before(() => {
    cy.readFile('./images/tiger.jpg', 'binary').its('length').then((bytes) => {
      expect(bytes, 'tiger image bytes').to.be.gt(10000)
      tigerImageSizeBytes = bytes
    })
  })

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
        expect(res.statusCode).to.equal(200)
        expect(res.body.byteLength).to.equal(tigerImageSizeBytes)
        res.setDelay(2000)
      })
    }).as('image')

    cy.visit('/pics.html')
    cy.wait('@image')

    cy.get('img[src="images/tiger.jpg"]').should('be.visible')
    .and(checkTigerImageResolution)
  })
})
