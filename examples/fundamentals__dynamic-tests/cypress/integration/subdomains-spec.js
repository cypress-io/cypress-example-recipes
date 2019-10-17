/// <reference types="cypress" />
describe('Subdomains', () => {
  // logo selector on public static site after moving to Gatsby
  const logoSelector = 'img[alt="Cypress.io"]'

  // ignore errors from the site itself
  Cypress.on('uncaught:exception', () => {
    return false
  })

  // run the same test against different subdomain
  const urls = ['https://docs.cypress.io', 'https://www.cypress.io']

  urls.forEach((url) => {
    it(`Should display logo on ${url}`, () => {
      cy.visit(url)

      // our logo is different on static site vs documentation site
      const selector = url.includes('www') ? logoSelector : '#logo'

      cy.get(selector).should('be.visible')
    })
  })
})
