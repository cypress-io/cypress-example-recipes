describe('intercept', () => {
    cy.intercept('/api/roles')
    // will match https://example.com/api/roles
    // will not match https://example.com/api/roles?country=US
    
    cy.intercept('/api/roles*')
    // will match https://example.com/api/roles
    // will match https://example.com/api/roles?country=US
    
    cy.intercept('/api/roles?*utm_source=+(My%App|https*)')
    // will match https://example.com/api/roles?utm_medium=Nav&utm_campaign=Docs&utm_source=My%App
    // will match https://example.com/api/roles?utm_medium=Nav&utm_campaign=Docs&utm_source=https://....
})
