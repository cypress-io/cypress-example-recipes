// load the global Cypress types
/// <reference types="cypress" />
// load the 3rd party command definition for cy.waitUntil()
/// <reference types="cypress-wait-until" />

// load https://github.com/NoriSte/cypress-wait-until
// which adds "cy.waitUntil" command
// note that this 3rd party module includes TypeScript "types"
// file that correctly adds "waitUntil" to the Cypress Chainer namespace
require('cypress-wait-until')

/**
 * Adds custom command "cy.dataCy" to the global "cy" object
 *
 * @example cy.dataCy('greeting')
 */
Cypress.Commands.add('dataCy', (value) => cy.get(`[data-cy=${value}]`))

// the types for cy.dataCy will be defined in "index.d.ts" file
