/// <reference types="cypress" />
import { skipOn } from '@cypress/skip-test'

describe('Recipe: blogs__iframes', () => {
  skipOn('firefox', () => {
    // using test retries to get occasional (rare) flake
    // https://github.com/cypress-io/cypress-example-recipes/issues/558
    it('gets the post using custom command', { retries: { runMode: 2 } }, () => {
      cy.visit('index.html')
      cy.getIframeBody()
      .find('#run-button').should('have.text', 'Try it').click()

      cy.getIframeBody()
      .find('#result').should('include.text', '"delectus aut autem"')
    })
  })
})
