# unit-test-application-code
> Load and unit test application code without loading a web page

In [cypress/integration](cypress/integration) folder the specs show:

- [unit_test_application_code_spec.js](cypress/integration/unit_test_application_code_spec.js) loads functions from the application and unit tests them.
- [wait-for-object-property-spec.js](cypress/integration/wait-for-object-property-spec.js) shows how Cypress can wrap and object and wait for a new property to be added to it (or deleted or modified).
- [wait-for-window-property-spec.js](cypress/integration/wait-for-window-property-spec.js) shows how an application can "signal" that it is ready to be tested by adding a property to the `window` object. The test will wait for the new property to appear.
