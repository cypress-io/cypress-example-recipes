describe('Console', () => {
  describe('spying console.log', function () {
    beforeEach(function () {
      cy.visit('/index.html', {
        onBeforeLoad(win) {
          cy.stub(win.console, 'log').as('consoleLog')
        }
      })
    })
  
    it('see console log being called with url', function () {
      cy.get('#console-log').click()
  
      cy.get('@consoleLog').should('be.calledWith', 'Hello World!')
    })
  })

  describe('replace console.log', function () {
    let parameter;
    let promise;

    beforeEach(() => {
      promise = new Promise(resolve => {
        cy.visit('/index.html', {
          onBeforeLoad(win) {
            cy.stub(win.console, 'log', x => {
              parameter = x;
              resolve();
             })
          }
        })
      });
    })
  
    it('utilize promise to wait until stub has been executed', function () {
      cy.get('#console-log').click()
        .then(() => promise)
        .then(() => assert.equal(parameter, 'Hello World!'))
    })
  })
})
