# hover-hidden-elements
> Interact with elements that are hidden by CSS

See [cypress/e2e/hover-hidden-elements-spec.cy.js](cypress/e2e/hover-hidden-elements-spec.cy.js) to find how to get around Cypress' lack of `.hover()` command.

- Interact with elements that are hidden by CSS.
- Use [`.invoke()`](https://on.cypress.io/invoke) and [`.trigger()`](https://on.cypress.io/trigger) to simulate hovering.
- Trigger `mouseover`, `mouseout`, `mouseenter`, `mouseleave` events.
- Get around the lack of a `.hover()` command.

![Test runner](images/hidden.png)
