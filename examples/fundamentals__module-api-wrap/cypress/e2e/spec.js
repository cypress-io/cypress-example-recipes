/// <reference types="cypress" />
describe('Cypress Run wrap', () => {
  // all "cypress run" values should be parsed from the command line arguments
  // and correctly passed into "cypress.run({ ... })" method call
  // https://on.cypress.io/configuration

  it('sets the port number', () => {
    expect(Cypress.config('port')).to.equal(5004)
  })

  it('sets the expected config variables by parsing --config', () => {
    expect(Cypress.config()).to.include({
      video: false,
      viewportWidth: 100,
      viewportHeight: 300,
    })
  })

  it('sets the environment variables by parsing --env', () => {
    expect(Cypress.env()).to.include({
      MY_FLAG: true,
    })
  })
})
