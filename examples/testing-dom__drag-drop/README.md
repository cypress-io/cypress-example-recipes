# drag-n-drop

> Performing Drag & Drop by triggering mouse and drag events

See test file [cypress/e2e/drag_n_drop_spec.cy.js](cypress/e2e/drag_n_drop_spec.cy.js) that shows how to simulate drag & drop behavior using

- mouse events
- drag events

In both cases, the tests use [`cy.trigger`](https://on.cypress.io/trigger) command.

Alternatively use [`cypress-file-upload`](https://github.com/abramenal/cypress-file-upload) if you test file upload with drag-n-drop component
