/// <reference types="cypress" />
context('Navigator', () => {
  describe('stubbing navigator.cookieEnabled', () => {
    it('cookies are disabled for user', () => {
      cy.visit('index.html', {
        onBeforeLoad(win) {
          cy.stub(win.navigator, 'cookieEnabled', false).as('cookieEnabled')
        },
      })

      cy.get('#message').should('contain', 'Error: cookies not enabled!')
    })

    it('cookies are enabled for user', () => {
      cy.visit('index.html')

      cy.get('#message').should('contain', 'Yay! cookies are enabled!')
    })
  })
})
