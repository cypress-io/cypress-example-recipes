/// <reference types="Cypress" />
describe('Browser notifications', () => {
  it('are supported by the test browser', () => {
    cy.visit('index.html')
    cy.window().should('have.property', 'Notification').should('be.a', 'function')
  })

  it('creates Notification if was previously granted', () => {
    // see cy.visit options in https://on.cypress.io/visit
    cy.visit('index.html', {
      onBeforeLoad (win) {
        // https://on.cypress.io/stub
        cy.stub(win.Notification, 'permission', 'granted')
        cy.stub(win, 'Notification').as('Notification')
      },
    })

    cy.get('button').click()
    cy.get('@Notification')
    .should('have.been.calledWithNew')
    .and('have.been.calledWithExactly', 'Permission was granted before')
  })

  it('asks for permission first, then shows notification if granted', () => {
    cy.visit('index.html', {
      onBeforeLoad (win) {
        cy.stub(win.Notification, 'permission', 'unknown')
        cy.stub(win.Notification, 'requestPermission').resolves('granted').as('ask')
        cy.stub(win, 'Notification').as('Notification')
      },
    })

    cy.get('button').click()
    cy.get('@ask').should('have.been.calledOnce').and('have.been.calledBefore', cy.get('@Notification'))
  })

  it('asks for permission first, does nothing if denied', () => {
    cy.visit('index.html', {
      onBeforeLoad (win) {
        cy.stub(win.Notification, 'permission', 'unknown')
        cy.stub(win.Notification, 'requestPermission').resolves('denied').as('ask')
        cy.stub(win, 'Notification').as('Notification')
      },
    })

    cy.get('button').click()
    cy.get('@ask').should('have.been.calledOnce')
    cy.get('@Notification').should('not.have.been.called')
  })

  it('does not show notification if permission was denied before', () => {
    cy.visit('index.html', {
      onBeforeLoad (win) {
        cy.stub(win.Notification, 'permission', 'denied')
        cy.stub(win.Notification, 'requestPermission').resolves('denied').as('ask')
        cy.stub(win, 'Notification').as('Notification')
      },
    })

    cy.get('button').click()
    cy.get('@Notification').should('not.have.been.called')
  })

  // NOTE: spying breaks for constructors that should be called with "new" keyword
  it.skip('spying on Notification does not work', () => {
    cy.visit('index.html', {
      onBeforeLoad (win) {
        cy.stub(win.Notification, 'permission', 'granted')
        // the problematic command causing problem
        cy.spy(win, 'Notification').as('Notification')
      },
    })

    cy.get('button').click()
    cy.get('@Notification')
    .should('have.been.calledWithNew')
    .and('have.been.calledWithExactly', 'Permission was granted before')
  })
})
