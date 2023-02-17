/// <reference types="cypress" />
describe('Subdomains', () => {
  const urlToLogoSelector = {
    // logo selector at https://docs.cypress.io/
    'https://docs.cypress.io': 'img[alt="Cypress Logo"]',
    // on the public static site, the logo is rendered within a labeled link
    'https://www.cypress.io': 'a[aria-label="Cypress"]',
  }

  // ignore errors from the site itself
  Cypress.on('uncaught:exception', () => {
    return false
  })

  // run the same test against different subdomain
  const urls = Object.keys(urlToLogoSelector)

  urls.forEach((url) => {
    it(`Should display logo on ${url}`, () => {
      cy.visit(url)

      const selector = urlToLogoSelector[url]

      expect(selector, `logo selector for ${url}`).to.be.a('string')

      cy.get(selector).should('be.visible')
    })
  })
})
