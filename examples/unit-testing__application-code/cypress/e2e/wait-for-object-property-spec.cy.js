/// <reference types="cypress" />

// several unit tests showing how Cypress wraps an object
// and can wait for a property to:
//  - change its value
//  - be added to the object
//  - be deleted from the object
context('waiting for a property of an object', () => {
  it('detects an existing property', () => {
    // assert given object has a property with a given value
    expect({ foo: 42 }).to.have.property('foo', 42)

    // alternative - use cy.wrap + "should" syntax
    // @see https://on.cypress.io/wrap
    cy.wrap({ foo: 42 }).should('have.property', 'foo', 42)
  })

  it('waits for changed property value', () => {
    const o = { foo: 20 }

    // changes property "foo" after delay
    setTimeout(() => {
      o.foo = 42
    }, 100)

    // "expect" syntax does NOT work
    // because it is not retried!
    // expect(o).to.have.property('foo', 42)

    // wrapping an object and using "should" syntax retries
    // the assertion until the "o.foo = 42" runs and the assertion passes
    cy.wrap(o).should('have.property', 'foo', 42)
  })

  it('waits for added property value', () => {
    const o = {}

    setTimeout(() => {
      o.foo = 42
    }, 100)

    // wrapping an object and using "should" syntax retries
    // the assertion until the "o.foo = 42" runs and the assertion passes
    cy.wrap(o).should('have.property', 'foo', 42)

    // if we are not interested in the value we could use assertion
    //  .should('have.property', 'foo')
  })

  it('waits for added property using .its', () => {
    const o = {}

    setTimeout(() => {
      o.foo = 42
    }, 100)

    // @see https://on.cypress.io/its
    cy.wrap(o)
    .its('foo')
    .should('exist')
  })

  it('waits for property to be deleted', () => {
    const o = {
      foo: 42,
    }

    setTimeout(() => {
      delete o.foo
    }, 100)

    // @see https://on.cypress.io/its
    // we cannot use cy.wrap(o).its('foo').should...
    // because the property exists from the start and becomes
    // the subject of the command chain right away
    // so we must wrap the object and use assertion on the object
    cy.wrap(o).should('not.have.property', 'foo')
  })

  it('waits for added property value using .its', () => {
    const o = {}

    setTimeout(() => {
      o.foo = 42
    }, 100)

    // @see https://on.cypress.io/its
    cy.wrap(o)
    .its('foo')
    .should('eq', 42)
  })

  it('waits for added nested property value', () => {
    const o = {}

    setTimeout(() => {
      o.foo = {
        bar: {
          baz: 42,
        },
      }
    }, 100)

    // cy.its is awesome for waiting for a nested property that
    // passes assertion after it
    cy.wrap(o)
    .its('foo.bar.baz')
    .should('equal', 42)
  })

  it('waits for deleted nested property', () => {
    const o = {
      foo: {
        bar: {
          baz: 42,
        },
      },
    }

    setTimeout(() => {
      delete o.foo.bar.baz
    }, 100)

    // traverse the object to {baz: 42} and retry assertion
    // until the subject {baz: 42} does NOT have property "baz"
    cy.wrap(o)
    .its('foo.bar')
    .should('not.have.property', 'baz')
  })
})
