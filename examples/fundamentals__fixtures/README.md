# Fixtures

You can load fixture data using the [`cy.fixture()`](https://on.cypress.io/fixture) command. The tests in the [cypress/e2e](cypress/e2e) folder show how to:

- Load a single file in [single-fixture-spec.cy.js](cypress/e2e/single-fixture-spec.cy.js)
- Load multiple files using closures in [multiple-fixtures-spec.cy.js](cypress/e2e/multiple-fixtures-spec.cy.js)
- Load multiple files once or before each test in [load-fixtures-spec.cy.js](cypress/e2e/load-fixtures-spec.cy.js)
- Require multiple JSON fixtures in [require-fixtures-spec.cy.js](cypress/e2e/require-fixtures-spec.cy.js)
- Iterate over a list loaded from a JSON fixture in [list-spec.cy.js](cypress/e2e/list-spec.cy.js)

For more examples see the "Fixtures" section in the [Cypress Testing Workshop](https://github.com/cypress-io/testing-workshop-cypress).
