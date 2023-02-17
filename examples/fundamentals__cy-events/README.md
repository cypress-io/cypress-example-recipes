# Cypress events

For more details, see [Cypress catalogue of events](https://on.cypress.io/catalog-of-events)

- [cypress-on-spec.cy.js](./cypress/e2e/cypress-on-spec.cy.js) shows how we can add a property to every `window` object before the app load using `Cypress.on('window:before:load', ...)` event listener
- [cy-on-spec.cy.js]('./cypress/e2e/cy-on-spec.cy.js) shows how to add a property to every `window` object before the app loads using `cy.on('window:before:load', ...)` event listener.

## See also

- recipe "Handling errors" from the [Fundamentals recipes](https://github.com/cypress-io/cypress-example-recipes#fundamentals)
