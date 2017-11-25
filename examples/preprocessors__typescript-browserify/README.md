# Typescript with Browserify

This is an example showing TypeScript tests with Cypress using Browserify

It uses [browserify](http://browserify.org/) to transpile TypeScript tests
via [@cypress/browserify-preprocessor](https://github.com/cypress-io/cypress-browserify-preprocessor)
and [tsify](https://github.com/TypeStrong/tsify)

See:
- [tsconfig.js](tsconfig.js)
- [cypress/plugins/index.js](cypress/plugins/index.js)
- [example test](cypress/integration/spec.ts)
