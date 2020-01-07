/* global chai */
// because this file is imported from cypress/support/index.js
// that means all other spec files will have this assertion plugin
// available to them because the supportFile is bundled and served
// prior to any spec files loading
import chaiDateString from 'chai-date-string'

// chai is a global exposed by Cypress which means
// we can just simply extend it
chai.use(chaiDateString)

/**
 * Example that shows how to write a custom Chai assertion.
 *
 * @see https://www.chaijs.com/guide/helpers/
 * @example
 ```
  expect('foo').to.be.foo()
  expect('bar').to.not.be.foo()
  cy.wrap('foo').should('be.foo')
  cy.wrap('bar').should('not.be.foo')
```
 * */
const isFoo = (_chai, utils) => {
  function assertIsFoo (options) {
    this.assert(
      this._obj === 'foo',
      'expected #{this} to be string "foo"',
      'expected #{this} to not be string "foo"',
      this._obj
    )
  }

  _chai.Assertion.addMethod('foo', assertIsFoo)
}

// registers our assertion function "isFoo" with Chai
chai.use(isFoo)
