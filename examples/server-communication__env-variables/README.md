# Server communication: passing environment variables

This recipe shows how to pass environment variables to your tests

- See [package.json](package.json) which runs Cypress with environment variables set. The variables that start with `CYPRESS_` are extracted automatically. Other variables are copied from `process.env` in the script [cypress/plugins/index.js](cypress/plugins/index.js)
- Additional variables can be passed via `env` object in [cypress.json](cypress.json)
- Extract any other variable from `process.env` using `cypress/plugins/index.js` callback.
