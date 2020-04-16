# Stubbing Navigator

This is an example showing how to stub `navigator.cookieEnabled`.

## The application

The application [index.html](index.html) displays a different message depending on whether the user has cookies enabled via the `navigator.cookieEnabled` value.

## The tests

- [cypress/integration/spec.js](cypress/integration/spec.js) stubs the `window.navigator.cookieEnabled` method using [`cy.stub()`](https://on.cypress.io/stub). We create the method stub within the `onBeforeLoad` of the [`cy.visit()`](https://on.cypress.io/visit)

![Window open stub](images/navigator-cookie-enabled.png)
