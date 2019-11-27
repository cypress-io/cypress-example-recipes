# Flow with Browserify

This is an example showing how to add Flow support for Cypress using Browserify.

Whether you use Flow in your test files or just in the source files you need to preprocess them before running the tests so Cypress runs plain JavaScript.

It uses [browserify](http://browserify.org/) to preprocess Flow files
via [@cypress/browserify-preprocessor](https://github.com/cypress-io/cypress-browserify-preprocessor)
and [@babel/preset-flow](https://github.com/babel/babel/tree/master/packages/babel-preset-flow) to transpile those files.

## Install
`npm install --save-dev @cypress/browserify-preprocessor @babel/preset-flow`

See:
- [cypress/plugins/index.js](cypress/plugins/index.js)
- [example test](cypress/integration/spec.js)
- [support/add.js](cypress/support/add.js)
