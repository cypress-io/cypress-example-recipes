/// <reference types="cypress" />
describe('browser', () => {
  it('works', () => {
    cy.log(
      `Running in browser **${Cypress.browser.displayName} v${
        Cypress.browser.majorVersion
      }**`
    )

    cy.task('echo', { browser: Cypress.browser })
  })
})
