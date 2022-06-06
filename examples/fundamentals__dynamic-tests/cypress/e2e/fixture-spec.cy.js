/// <reference types="cypress" />
describe('generated from fixture', () => {
  // We cannot load JSON file using "cy.fixture"
  // because it means the test is already running.
  // Same with using "before" hook - new tests cannot be created from "before" hook.
  // Instead we need to load JSON file using "require" at the start time
  // and generate tests.
  const colors = require('../fixtures/colors')
  const rainbow = ['red', 'orange', 'yellow', 'green', 'blue', 'violet']

  colors.forEach((color) => {
    it(`🌈 has color ${color}`, () => {
      cy.wrap(color).should('be.oneOf', rainbow)
    })
  })
})
