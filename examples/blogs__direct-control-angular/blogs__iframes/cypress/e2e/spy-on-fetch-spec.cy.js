/// <reference types="cypress" />
import { skipOn } from '@cypress/skip-test'

const getIframeWindow = () => {
  return cy
  .get('iframe[data-cy="the-frame"]')
  .its('0.contentWindow').should('exist')
}

describe('Recipe: blogs__iframes', () => {
  skipOn('firefox', () => {
    it('spies on window.fetch method call', () => {
      cy.visit('index.html')

      getIframeWindow().then((win) => {
        cy.spy(win, 'fetch').as('fetch')
      })

      cy.getIframeBody().find('#run-button').should('have.text', 'Try it').click()
      cy.getIframeBody().find('#result').should('include.text', '"delectus aut autem"')

      // because the UI has already updated, we know the fetch has happened
      // so we can use "cy.get" to retrieve it without waiting
      // otherwise we would have used "cy.wait('@fetch')"
      cy.get('@fetch').should('have.been.calledOnce')
      // let's confirm the url argument
      .and('have.been.calledWith', 'https://jsonplaceholder.cypress.io/todos/1')
    })
  })
})
