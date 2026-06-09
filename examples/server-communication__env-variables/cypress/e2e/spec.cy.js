/// <reference types="cypress" />
// https://on.cypress.io/environment-variables
describe('process environment variables', () => {
  // Secret / private values live server-side in config.env and are read in the
  // spec with cy.env([...keys]), which resolves to an object of just the
  // requested keys. (Cypress.env() was removed in Cypress 16 — there is no
  // "get all" form, so each test requests the specific keys it needs.)

  it('has variable my-var from cypress.config.js', () => {
    cy.env(['my-var']).then((env) => {
      expect(env['my-var']).to.equal('ok')
    })
  })

  it('has variables FOO and BAR from process.env', () => {
    // FOO=42 BAR=baz cypress run
    // see how FOO and BAR were copied in the `setupNodeEvents` function
    // in the Cypress configuration
    cy.env(['FOO', 'BAR']).should('include', {
      FOO: '42',
      BAR: 'baz',
    })
  })

  it('has renamed variable "ping" from "CYPRESS_ping"', () => {
    // CYPRESS_ping=123 cypress run
    // NOTE passed variable is a number
    cy.env(['ping']).then(({ ping }) => {
      expect(ping).to.equal(123)
    })
  })

  it('has variable loaded from .env file', () => {
    // loaded in the `setupNodeEvents` function in the Cypress configuration
    cy.env(['username']).then(({ username }) => {
      expect(username).to.equal('aTester')
    })
  })

  it('removes CYPRESS_ and cypress_ prefixes', () => {
    cy.env(['my-var', 'ping', 'HOST', 'api_server'])
    .should('include', {
      'my-var': 'ok',
      ping: 123,
      HOST: 'laura.dev.local',
      api_server: 'http://localhost:8888/api/v1/',
    })
  })

  // Non-sensitive values that are safe to expose everywhere (browser, every
  // origin) use the `expose` test-config override + Cypress.expose(), which is
  // read synchronously. (The `env` test-config override was removed in
  // Cypress 16; `expose` is its replacement.)
  context('Suite expose variables', {
    expose: {
      suiteApi: 'https://staging.dev',
      commonFlag: 'suite',
    },
  }, () => {
    it('has all exposed variables', () => {
      expect(Cypress.expose('suiteApi')).to.equal('https://staging.dev')
    })

    it('has test-specific exposed variables', {
      expose: {
        testFlag: 42,
        commonFlag: 'test',
      },
    }, () => {
      expect(Cypress.expose('testFlag'), 'test level variable').to.equal(42)
      expect(Cypress.expose('commonFlag'), 'test overrides suite').to.equal('test')
      expect(Cypress.expose('suiteApi'), 'suite level variable').to.equal('https://staging.dev')
    })

    it('has its own variable 1', {
      expose: {
        testOne: true,
      },
    }, () => {
      expect(Cypress.expose()).to.include({
        testOne: true,
      })
    })

    it('has its own variable 2', {
      expose: {
        testTwo: true,
      },
    }, () => {
      expect(Cypress.expose(), 'has variable from this test').to.include({
        testTwo: true,
      })
    })
  })
})
