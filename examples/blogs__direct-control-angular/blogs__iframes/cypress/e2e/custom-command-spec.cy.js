/// <reference types="cypress" />
import { skipOn } from '@cypress/skip-test'

describe('Recipe: blogs__iframes', () => {
  skipOn('firefox', () => {
    it('gets the post using custom command', () => {
      cy.visit('index.html')
      cy.getIframeBody()
      .find('#run-button').should('have.text', 'Try it').click()

      cy.getIframeBody()
      .find('#result').should('include.text', '"delectus aut autem"')
    })
  })
})
