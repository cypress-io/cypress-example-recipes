# Typescript with Browserify

This is an example showing TypeScript tests with Cypress using Browserify. See Cypress' [TypeScript Support](https://on.cypress.io/typescript-support) docs for more details.

It uses [browserify](http://browserify.org/) to transpile TypeScript tests
via [@cypress/browserify-preprocessor](https://github.com/cypress-io/cypress-browserify-preprocessor#typescript)

See:
- [tsconfig.json](tsconfig.json)
- [cypress.config.js](cypress.config.js)
- [example test](cypress/e2e/spec.ts)
