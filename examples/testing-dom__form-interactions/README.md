# form-interactions

> Shows how to change the value of a range input

- Use [`.invoke()`](https://on.cypress.io/invoke) and [`.trigger()`](https://on.cypress.io/trigger) to test a range input (slider).

The test triggers `change` event on an `<input name="range-input" type="range" value="0" />` form element and asserts the value does get changed.

![range input](images/range-input.png)

## See

- [cypress/integration/form-interactions-spec.js](cypress/integration/form-interactions-spec.js)
- [`cy.trigger`](https://on.cypress.io/trigger)
