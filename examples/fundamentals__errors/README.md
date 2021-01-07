# Handling application errors

## Exceptions

## Unhandled promise rejections

If the application code creates an unhandled rejected promise, Cypress does NOT see it by default and continues with the test. If you want to fail the test, listen to the unhandled promise event and throw an error.

![Test failing after an application has unhandled rejected promise](./images/unhandled-promise.gif)

You can register your own unhandled promise event listener during `cy.visit` as [cypress/integration/unhandled-promise.js](./cypress/integration/unhandled-promise.js) shows.
