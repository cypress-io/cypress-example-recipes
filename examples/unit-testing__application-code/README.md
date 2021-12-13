# unit-test-application-code
> Load and unit test application code without loading a web page

- Unit test your own application code libraries.
- Import modules using ES2015.
- Test simple math functions.
- Test the canonical *fizzbuzz* test.
- Automatically retry assertion until a given property inside an object:
  * is added or deleted
  * has expected value
- unit test asynchronous code using promises and async / await

In [cypress/e2e](cypress/e2e) folder the specs show:

- [unit_test_application_code_spec.cy.js](cypress/e2e/unit_test_application_code_spec.cy.js) loads functions from the application and unit tests them.
- [wait-for-object-property-spec.cy.js](cypress/e2e/wait-for-object-property-spec.cy.js) shows how Cypress can wrap and object and wait for a new property to be added to it (or deleted or modified).
- [wait-for-window-property-spec.cy.js](cypress/e2e/wait-for-window-property-spec.cy.js) shows how an application can "signal" that it is ready to be tested by adding a property to the `window` object. The test will wait for the new property to appear.
- [async-tests.cy.js](cypress/e2e/async-tests.cy.js) shows how to unit test asynchronous functions from [async-methods.js](async-methods.js) using Promises or async / await syntax

**note:** the specs load the application directly, there is no web server to start. Just do `npm run cypress:run` to open Cypress and run the unit tests.
