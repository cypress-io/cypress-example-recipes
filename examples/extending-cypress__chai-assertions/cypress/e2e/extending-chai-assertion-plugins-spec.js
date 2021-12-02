/* global chai */
/// <reference types="Cypress" />
/// <reference path="../support/index.d.ts" />

// we installed this node_module in package.json
// https://github.com/hurrymaplelad/chai-colors
import chaiColors from 'chai-colors'

// and we are extending chai to use this assertion
// plugin, but this plugin will only be available once
// this spec file runs.
//
// if we were running any other spec file
// it would not have access to this plugin
chai.use(chaiColors)

describe('Chai Assertion Plugins', function () {
  context('chai-date-string', function () {
    // we installed this node_module in package.json
    // https://github.com/googoid/chai-date-string
    //
    // the reason we can use this assertion plugin without
    // importing it in this file is that it's been globally
    // imported from our supportFile
    //
    // if look inside cypress/support/index.js
    // you'll see that we import cypress/support/assertions.js
    // and because the supportFile is bundled before our spec file,
    // it means we already have access to it
    it('can be used in any spec file', function () {
      expect('2015-11-12').to.be.a.dateString()
    })

    it('can be wrapped by Cypress as well', function () {
      cy.wrap('2016-03-14').should('be.a.dateString')
    })

    it('can be negated', function () {
      expect('2015-14-41').not.to.be.a.dateString()
    })

    it('can be negated using Cypress', function () {
      cy.wrap('2015-14-41').should('not.be.a.dateString')
    })
  })

  context('chai-colors', function () {
    it('can convert rgba to hex', function () {
      expect('rgba(0, 0, 0, 1)').to.be.colored('#000000')
    })

    it('can be wrapped by Cypress as well', function () {
      cy.wrap('rgba(0, 0, 0, 1)').should('be.colored', '#000000')
    })

    it('can be negated', function () {
      expect('#650042').not.to.be.colored('rgba(1, 2, 3, 4)')
    })

    it('can be negated using Cypress', function () {
      cy.wrap('#ff0000').should('not.be.colored', 'green')
    })
  })

  context('custom assertion', () => {
    it('checks if a given string is "foo" or not', () => {
      expect('foo').to.be.foo()
      expect('bar').to.not.be.foo()

      cy.wrap('foo').should('be.foo')
      cy.wrap('bar').should('not.be.foo')
    })
  })
})
