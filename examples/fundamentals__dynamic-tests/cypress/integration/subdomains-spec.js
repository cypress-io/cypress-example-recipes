/// <reference types="cypress" />
describe('Subdomains', () => {
  const urlToLogoSelector = {
    // logo selector at https://docs.cypress.io/
    'https://docs.cypress.io': 'img[alt="Cypress Docs Logo"]',
    // logo selector on public static site after moving to Gatsby
    'https://www.cypress.io': 'img[alt="Cypress.io"]',
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
