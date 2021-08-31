# Cypress events

For more details, see [Cypress catalogue of events](https://on.cypress.io/catalog-of-events)

- [cypress-on-spec.js](./cypress/integration/cypress-on-spec.js) shows how we can add a property to every `window` object before the app load using `Cypress.on('window:before:load', ...)` event listener
- [cy-on-spec.js](./cypress/integration/cy-on-spec.js) shows how to add a property to every `window` object before the app loads using `cy.on('window:before:load', ...)` event listener.

## See also

- recipe "Handling errors" from the [Fundamentals recipes](https://github.com/cypress-io/cypress-example-recipes#fundamentals)
