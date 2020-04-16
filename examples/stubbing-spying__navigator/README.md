# Stubbing Navigator

This is an example showing how to stub `navigator.cookieEnabled`.

## The application

The application [index.html](index.html) displays a different message depending on whether the user has cookies enabled via the `navigator.cookieEnabled` value.

## The tests

- [cypress/integration/spec.js](cypress/integration/spec.js) stubs the `window.navigator.cookieEnabled` method using [`cy.stub()`](https://on.cypress.io/stub). We create the method stub within the `onBeforeLoad` of the [`cy.visit()`](https://on.cypress.io/visit)

![Window open stub](images/navigator-cookie-enabled.png)

## More info

- [Testing the Browser Notification API](https://www.cypress.io/blog/2020/01/24/testing-the-browser-notification-api/)
- [Stub navigator API in end-to-end tests](https://glebbahmutov.com/blog/stub-navigator-api/)
