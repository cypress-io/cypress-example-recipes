/// <reference types="cypress" />

// before visiting the page, we have blocked the www.google-analytics.com host
// which prevents the GA script from ever loading. however because there
// is still a global 'window.ga' function, that means we can stub it
// and ensure its called correctly.
//
// if you pop open your dev tools you will see that the network request
// for the script tag returns 503 because it's been blocked.

describe('Google Analytics', function () {
  // using a global event handler here because likely
  // in your real app you'll always want to stub window.ga
  //
  // if not you could just add a onBeforeLoad() callback
  // to the cy.visit
  Cypress.on('window:before:load', (win) => {
  // because this is called before any scripts
  // have loaded - the ga function is undefined
  // so we need to create it.
    win.ga = cy.stub().as('ga')
  })

  beforeEach(function () {
    cy.intercept({ hostname: 'www.google-analytics.com' }, { statusCode: 503 })
    cy.visit('/index.html')
  })

  it('can ensure window.ga is called correctly', function () {
    cy
    .get('@ga')
    // ensure GA was created with our google analytics ID
    .should('be.calledWith', 'create', 'UA-XXXXX-Y')
    // and ensure that the initial pageview was sent
    .and('be.calledWith', 'send', 'pageview')

    // now click the anchor tag which causes a hashchange event
    cy.contains('#page2').click()

    cy.hash().should('equal', '#page2')

    // make sure GA was sent this pageview
    cy.get('@ga').should('be.calledWith', 'send', 'pageview', '#page2')

    // and now do it again for page3
    cy.contains('#page3').click()
    cy.hash().should('equal', '#page3')
    cy.get('@ga').should('be.calledWith', 'send', 'pageview', '#page3')
  })
})
