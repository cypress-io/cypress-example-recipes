/// <reference types="cypress" />
// https://on.cypress.io/environment-variables
describe('process environment variables', () => {
  it('has variable my-var from cypress.json', () => {
    expect(Cypress.env('my-var')).to.equal('ok')
  })

  it('has variables FOO and BAR from process.env', () => {
    // FOO=42 BAR=baz cypress open
    // see how FOO and BAR were copied in "cypress/plugins/index.js"
    expect(Cypress.env()).to.contain({
      FOO: '42',
      BAR: 'baz',
    })
  })

  it('has renamed variable "ping" from "CYPRESS_ping"', () => {
    // CYPRESS_ping=123 cypress open
    // NOTE passed variable is a number
    expect(Cypress.env('ping')).to.equal(123)
  })

  it('has variable loaded from .env file', () => {
    // loaded in the plugins file
    expect(Cypress.env('username')).to.equal('aTester')
  })

  it('removes CYPRESS_ and cypress_ prefixes', () => {
    cy.wrap(Cypress.env())
    .should('include', {
      'my-var': 'ok',
      ping: 123,
      HOST: 'laura.dev.local',
      api_server: 'http://localhost:8888/api/v1/',
    })
  })

  context('Suite env variables', {
    env: {
      suiteApi: 'https://staging.dev',
      commonFlag: 'suite',
    },
  }, () => {
    it('has all environment variables', () => {
      expect(Cypress.env('suiteApi')).to.equal('https://staging.dev')
    })

    // NOTE: does not work, seems test variables override
    // the suite variables but in a weird way (even after commenting out and
    // reloading the old variable is still there!)
    // https://github.com/cypress-io/cypress/issues/8005
    it.skip('has test-specific env variables', {
      env: {
        testFlag: 42,
        commonFlag: 'test',
      },
    }, () => {
      expect(Cypress.env('testFlag'), 'test level variable').to.equal(42)
      expect(Cypress.env('commonFlag'), 'test overrides suite').to.equal('test')
      expect(Cypress.env('suiteApi'), 'suite level variable').to.equal('https://staging.dev')
    })

    it('has its own variable 1', {
      env: {
        testOne: true,
      },
    }, () => {
      expect(Cypress.env()).to.include({
        testOne: true,
      })
    })

    // NOTE: leaking variable from previous test
    // https://github.com/cypress-io/cypress/issues/8005
    it.skip('has its own variable 2', {
      env: {
        testTwo: true,
      },
    }, () => {
      expect(Cypress.env(), 'has variable from this test').to.include({
        testTwo: true,
      })

      cy.log(Object.keys(Cypress.env()).join(', '))
      .then(() => {
        expect(Cypress.env(), 'does not have variable from first test').to.not.have.property('testOne')
      })
    })
  })
})
