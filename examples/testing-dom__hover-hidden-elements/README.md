# hover-hidden-elements
> Interact with elements that are hidden by CSS


See [cypress/integration/hover-hidden-elements-spec.js](cypress/integration/hover-hidden-elements-spec.js) to find how to get the lack if `.hover()` command.

- Use [`.invoke()`](https://on.cypress.io/invoke) and [`.trigger()`](https://on.cypress.io/trigger) to simulate hovering.
- Trigger `mouseover`, `mouseout`, `mouseenter`, `mouseleave` events.

![Test runner](images/hidden.png)
