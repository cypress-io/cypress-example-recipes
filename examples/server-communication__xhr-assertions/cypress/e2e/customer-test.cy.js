describe('Debug', () => {
  it('Can\'t intercept every algolia call', () => {
    cy.viewport('macbook-11')
    cy.setCookie('gdid', 'cypress')
    cy.intercept('**indexes/*/queries**').as('algolia')

    cy.visit('http://www.gofundme.com/s?q=help')
    cy.wait('@algolia').its('response.statusCode').should('eq', 200)
  })
})
