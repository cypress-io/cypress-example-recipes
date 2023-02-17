/// <reference types="cypress" />
import { skipOn } from '@cypress/skip-test'

describe('Recipe: blogs__iframes', () => {
  skipOn('firefox', () => {
    it('gets the post', () => {
      cy.visit('index.html').contains('XHR in iframe')
      cy.get('iframe')
    })
  })
})
