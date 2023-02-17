/// <reference types="cypress" />
// our Codepen has top level URL
const url = 'https://codepen.io/bahmutov/full/ZaMxgz/'
// that loads app from this URL
const iframeUrl = 'https://s.codepen.io/bahmutov/fullpage/ZaMxgz'

describe('HyperApp Counter Codepen', () => {
  beforeEach(function loadAppIFrameAndSetAsOurTestDocument () {
    // we could even cache the received HTML code
    cy.request({
      method: 'GET',
      url: iframeUrl,
      headers: {
        Referer: url,
        accept: 'text/html',
      },
    })
    .its('body')
    .then((html) => {
      cy.log('got document from url', iframeUrl)
      cy.log('document length', html.length)
      cy.wrap(html)
      .its('length')
      .should('be.greaterThan', 2000)

      const doc = cy.state('document')

      cy.log('Writing HTML into test document')
      doc.write(html)
      doc.close()
    })

    cy.wait(1000)
    cy.url().should('include', 'localhost:')
    cy.get('main').should('be.visible')
  })

  // a few utility functions for working with the app's DOM
  const getCount = () => cy.get('main').find('h1')

  it('starts with zero', () => {
    getCount().contains('0')
  })

  // NOTE: while it looks like buttons have regular ASCII "+" and "-"
  // in reality these are Unicode symbols ＋ and ー
  const getPlus = () => cy.get('main').contains('button', '＋')
  const getMinus = () => cy.get('main').contains('button', 'ー')

  it('increments and decrements via UI', () => {
    getPlus().click()
    getPlus().click()
    getPlus().click()
    getMinus().click()
    getCount()
    .contains(2)
    .should('be.visible')
  })

  it('has decrement button disabled initially', () => {
    getMinus().should('be.disabled')
  })

  it('cannot decrement by clicking on disabled minus button', () => {
    getCount()
    .contains(0)
    .should('be.visible')

    getMinus().click({ force: true }) // because button is disabled
    getCount()
    .contains(0)
    .should('be.visible')
  })

  it('enables decrement button for positive numbers', () => {
    getPlus().click()
    getMinus().should('not.be.disabled')

    getMinus().click()
    getMinus().should('be.disabled')
  })

  // returns window._app = app(...) reference
  // created in the Codepen
  const getApp = () => cy.window().its('_app')

  it('returns actions object', () => {
    getApp().should('have.all.keys', 'down', 'up')
  })

  it('can drive DOM via App\'s actions', () => {
    getApp().then((actions) => {
      actions.up()
      actions.up()
      actions.up()
      actions.down()
      getCount()
      .contains(2)
      .should('be.visible')
    })
  })

  it('can even drive App into invalid state', () => {
    getApp().then((actions) => {
      actions.down()
      actions.down()
      getCount()
      .contains(-2)
      .should('be.visible')

      getMinus().should('be.disabled')
    })
  })
})
