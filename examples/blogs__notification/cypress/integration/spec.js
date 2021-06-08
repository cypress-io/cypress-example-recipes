/// <reference types="Cypress" />
describe('Browser notifications', () => {
  it('are supported by the test browser', () => {
    cy.visit('index.html')
    cy.window().should('have.property', 'Notification').should('be.a', 'function')
  })

  it('shows alert if the browser does not support notifications', () => {
    cy.visit('index.html', {
      onBeforeLoad (win) {
        delete win.Notification
      },
    })

    cy.on('window:alert', cy.stub().as('alerted'))
    cy.get('button').click()
    cy.get('@alerted').should('have.been.calledOnce')
    .and('have.been.calledWith', 'This browser does not support desktop notification')
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
    cy.get('@ask')
    .should('have.been.calledOnce')
    .and('have.been.calledBefore', cy.get('@Notification'))
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

  it('spying on Notification', () => {
    cy.visit('index.html', {
      onBeforeLoad (win) {
        // the application checks if the permission was granted
        // using the property Notification.permission === 'granted'
        // which Sinon still supports, although it is marked deprecated
        cy.stub(win.Notification, 'permission', 'granted')
        cy.spy(win, 'Notification').as('Notification')
      },
    })

    cy.get('button').click()
    cy.get('@Notification')
    .should('have.been.calledWithNew')
    .and('have.been.calledWithExactly', 'Permission was granted before')
  })

  it('spying on Notification via a workaround', () => {
    cy.visit('index.html', {
      onBeforeLoad (win) {
        // let's wrap Notification constructor
        // to make sure it is always called with "new" keyword
        const _Notification = win.Notification

        win.Notification = function MockNotification (text) {
          // use "new" when calling true Notification
          return new _Notification(text)
        }

        // and copy the rest of the important properties
        win.Notification.requestPermission = _Notification.requestPermission
        win.Notification.permission = 'granted'

        // now spy on the wrapped Notification method
        cy.spy(win, 'Notification').as('Notification')
      },
    })

    cy.get('button').click()
    cy.get('@Notification')
    .should('have.been.calledWithNew')
    .and('have.been.calledWithExactly', 'Permission was granted before')
    .and('have.been.calledWithNew')
  })
})
