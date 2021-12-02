describe('intercept', () => {
  beforeEach(() => {
    cy.intercept('/api/roles')
    // will match https://example.com/api/roles
    // will not match https://example.com/api/roles?country=US

    cy.intercept('/api/roles*')
    // will match https://example.com/api/roles
    // will match https://example.com/api/roles?country=US

    cy.intercept('/api/roles?*utm_source=+(MyApp|https*)')
    // will match https://example.com/api/roles?utm_campaign=Docs&utm_source=MyApp
    // will match https://example.com/api/roles?utm_campaign=Docs&utm_source=https://....
    // will not match https://example.com/api/roles?utm_campaign=Docs&utm_source=marketing
  })
})
