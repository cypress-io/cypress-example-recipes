/// <reference types="cypress" />
import { skipOn } from '@cypress/skip-test'

let polyfill

// grab fetch polyfill from remote URL, could be also from a local package
before(() => {
  const polyfillUrl = 'https://unpkg.com/unfetch/dist/unfetch.umd.js'

  cy.request(polyfillUrl)
  .then((response) => {
    polyfill = response.body
  })
})

// yields iframe's document
const getIframeDocument = () => {
  return cy
  .get('iframe[data-cy="the-frame"]')
  .its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  return getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap)
}

const getIframeWindow = () => {
  return cy
  .get('iframe[data-cy="the-frame"]')
  .its('0.contentWindow').should('exist')
}

const replaceIFrameFetchWithXhr = () => {
  // see recipe "Stubbing window.fetch" in
  // https://github.com/cypress-io/cypress-example-recipes
  getIframeWindow().then((iframeWindow) => {
    delete iframeWindow.fetch
    // since the application code does not ship with a polyfill
    // load a polyfilled "fetch" from the test
    iframeWindow.eval(polyfill)
    iframeWindow.fetch = iframeWindow.unfetch

    // BUT to be able to spy on XHR or stub XHR requests
    // from the iframe we need to copy OUR window.XMLHttpRequest into the iframe
    cy.window().then((appWindow) => {
      iframeWindow.XMLHttpRequest = appWindow.XMLHttpRequest
    })
  })
}

describe('Recipe: blogs__iframes', () => {
  skipOn('firefox', () => {
    it('spies on XHR request', () => {
      cy.visit('index.html')

      replaceIFrameFetchWithXhr()
      // spy on XHR before clicking the button
      cy.server()
      cy.route('/todos/1').as('getTodo')

      getIframeBody().find('#run-button').should('have.text', 'Try it').click()

      // let's wait for XHR request to happen
      // for more examples, see recipe "XHR Assertions"
      // in repository https://github.com/cypress-io/cypress-example-recipes
      cy.wait('@getTodo').its('response.body').should('deep.equal', {
        completed: false,
        id: 1,
        title: 'delectus aut autem',
        userId: 1,
      })

      // and we can confirm the UI has updated correctly
      cy.getIframeBody().find('#result').should('include.text', '"delectus aut autem"')
    })

    it('stubs XHR response', () => {
      cy.visit('index.html')

      replaceIFrameFetchWithXhr()
      // spy on XHR before clicking the button
      cy.server()
      cy.route('/todos/1', {
        completed: true,
        id: 1,
        title: 'write tests',
        userId: 101,
      }).as('getTodo')

      cy.getIframeBody().find('#run-button').should('have.text', 'Try it').click()
      // and we can confirm the UI shows our stubbed response
      cy.getIframeBody().find('#result').should('include.text', '"write tests"')
    })
  })
})
