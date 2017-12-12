/* eslint-env mocha */
/* global cy */
describe('snapshots', () => {
  const add = (a, b) => a + b
  it('adds numbers', () => {
    cy.wrap(add(2, 3)).snapshot()
  })
})
