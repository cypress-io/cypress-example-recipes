// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// load https://github.com/NoriSte/cypress-wait-until
// which adds "cy.waitUntil" command
// note that this 3rd party module includes TypeScript "types"
// file that correctly adds "waitUntil" to the Cypress Chainer namespace
require('cypress-wait-until')
