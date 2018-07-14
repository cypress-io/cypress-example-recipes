describe('WebSockets', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('sends and receives messages', () => {
    cy
    .get('ul > li').should('not.be.visible')
    .get('input').type('Hello, World')
    .get('button').click()
    .get('ul > li')
    .get('ul > li').contains('Hello, World')
  })

})
