describe('window open', function () {
  beforeEach(function () {
    cy.visit('/index.html', {
      onBeforeLoad(win) {
        cy.stub(win, 'open').as('windowOpen')
      }
    })
  })

  it('see window open being called with url', function () {
    cy.get('#open-window').click()

    cy.get('@windowOpen').should('be.calledWith', 'page1.html')
  })
})
