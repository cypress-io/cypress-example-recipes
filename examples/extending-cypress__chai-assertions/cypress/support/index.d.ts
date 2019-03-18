/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainer<Subject> {
    /**
     * Custom Chai assertion that checks if given subject is string "foo"
     *
     * @example
     ```
    expect('foo').to.be.foo()
    cy.wrap('foo').should('be.foo')
    ```
    * */
    (chainer: 'be.foo'): Chainable<Subject>

    /**
     * Custom Chai assertion that checks if given subject is NOT string "foo"
     *
     * @example
     ```
    expect('bar').to.not.be.foo()
    cy.wrap('bar').should('not.be.foo')
    ```
    * */
   (chainer: 'not.be.foo'): Chainable<Subject>
  }
}
