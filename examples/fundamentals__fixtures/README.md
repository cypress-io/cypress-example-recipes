# Fixtures

You can load fixture data using the [`cy.fixture()`](https://on.cypress.io/fixture) command. The tests in the [cypress/integration](cypress/integration) folder show how to:

- Load a single file in [single-fixture-spec.js](cypress/integration/single-fixture-spec.js)
- Load multiple files using closures in [multiple-fixtures-spec.js](cypress/integration/multiple-fixtures-spec.js)
- Load multiple files once or before each test in [load-fixtures-spec.js](cypress/integration/load-fixtures-spec.js)
- Require multiple JSON fixtures in [require-fixtures-spec.js](cypress/integration/require-fixtures-spec.js)
- Iterate over a list loaded from a JSON fixture in [list-spec.js](cypress/integration/list-spec.js)

For more examples see the "Fixtures" section in the [Cypress Testing Workshop](https://github.com/cypress-io/testing-workshop-cypress).
