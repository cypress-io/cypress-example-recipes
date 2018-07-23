/// <reference types="Cypress" />

// Here, we remove window.fetch and polyfill it on top of XHRs.

// For most cases it is enough to just `delete window.fetch` because
// web code usually includes a polyfill for older browsers.
// But if the application code does not include a polyfill, our test
// code can load polyfill!
describe('polyfill window.fetch from tests', function () {
  let polyfill

  // grab fetch polyfill from remote URL, could be also from a local package
  before(() => {
    const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js'
    cy.request(polyfillUrl)
    .then((response) => {
      polyfill = response.body
    })
  })

  beforeEach(function () {
    // all calls will be done via XHR after we load polyfill
    // so we can spy on them using cy.route
    cy.server()
    cy.route('/favorite-fruits').as('fetchFavorites')

    // We use cy.visit({onBeforeLoad: ...}) to delete native fetch and load polyfill code instead
    cy.visit('/', {
      onBeforeLoad (win) {
        delete win.fetch
        // since the application code does not ship with a polyfill
        // load a polyfilled "fetch" from the test
        win.eval(polyfill)
        win.fetch = win.unfetch
      },
    })
  })

  it('requests favorite fruits', function () {
    // can spy now on XHR calls, while the application "thinks" it is using fetch
    // expect the server to return 5 items
    cy.wait('@fetchFavorites').its('response.body').should('have.length', 5)
  })
})
