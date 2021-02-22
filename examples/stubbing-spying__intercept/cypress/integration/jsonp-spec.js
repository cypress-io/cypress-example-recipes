/// <reference types="Cypress" />
/* global window */

// https://on.cypress.io/intercept
describe('intercept jsonp', { viewportHeight: 500, viewportWidth: 400 }, () => {
  it('has jQuery in the app', () => {
    cy.visit('/fruits-jsonp') // cy.visit yields the window object
    .its('jQuery')
    .should('be.a', 'function')
  })

  it('has working JSONP', () => {
    cy.visit('/fruits-jsonp')
    // expect 4 fruits
    cy.get('.favorite-fruits li').should('have.length', 4)
  })

  it('spies on JSONP request', () => {
    // prepare to intercept JSONP requests that will be something like
    // /favorite-fruits-jsonp?fruitsCallback=jQuery3510137647...
    cy.intercept({
      method: 'GET',
      pathname: '/favorite-fruits-jsonp',
      query: {
        // matches any value in this search parameter
        fruitsCallback: '*',
      },
    }).as('fruits')

    cy.visit('/fruits-jsonp')
    cy.wait('@fruits')
    .its('response').then((res) => {
      // let's get the callback method from the URL
      const url = new URL(res.url)
      const callbackName = url.searchParams.get('fruitsCallback')

      expect(callbackName, 'set by jQuery').to.be.a('string')

      // the response body is a JavaScript string of the form
      // callbackName(["fruit 1", "fruit 2", ...])
      // let's get this list of fruits by preparing a temporary
      // function for the "res.body" to call
      window[callbackName] = (fruits) => {
        expect(fruits).to.be.an('array').and.to.have.length(4)
        // by wrapping the "fruits" value we pass it to the next Cypress command
        cy.wrap(fruits)
      }

      window.eval(res.body)
      // clean up our temporary function
      delete window[callbackName]
    })
    // the previous callback yields the fruits
    .then((fruits) => {
      // make sure every fruit is displayed on the page
      expect(fruits).to.have.length.gt(1)
      fruits.forEach((fruit) => {
        cy.contains('.favorite-fruits li', fruit)
      })
    })
  })

  it('stubs a JSONP request', () => {
    // we will reply with these fruits
    const fruits = ['apples 🍎', 'grapes 🍇', 'kiwi 🥝']

    // prepare to intercept JSONP requests that will be something like
    // /favorite-fruits-jsonp?fruitsCallback=jQuery3510137647...
    cy.intercept({
      method: 'GET',
      pathname: '/favorite-fruits-jsonp',
      query: {
        // matches any value in this search parameter
        fruitsCallback: '*',
      },
    }, (req) => {
      // find the name of the callback method the app wants us to call
      const url = new URL(req.url)
      const callbackName = url.searchParams.get('fruitsCallback')

      expect(callbackName, 'set by jQuery').to.be.a('string')

      const fruitsText = JSON.stringify(fruits)
      const fruitsJavaScript = `${callbackName}(${fruitsText})`

      req.reply(fruitsJavaScript)
    })
    .as('fruits')

    cy.visit('/fruits-jsonp')
    // make sure the expected fruits are shown
    cy.get('.favorite-fruits li').should('have.length', fruits.length)
    fruits.forEach((fruit) => {
      cy.contains('.favorite-fruits li', fruit)
    })
  })
})
