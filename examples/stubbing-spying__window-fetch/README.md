# Spying on and stubbing `window.fetch`

Cypress observes and controls `fetch` calls natively. [`cy.intercept`](https://on.cypress.io/intercept) works in Cypress' proxy layer, outside the browser, so it sees `fetch` and `XMLHttpRequest` requests alike — no polyfill, no patching of the application, and no configuration flag to turn on.

There are two ways to take control of a `fetch` call:

- **[`cy.intercept()`](https://on.cypress.io/intercept)** controls the *network*. Stub the response body, status code, headers, or add a delay, and the application's own `fetch` runs untouched. This is usually what you want, since the application code under test runs unchanged.
- **[`cy.spy()`](https://on.cypress.io/spy) and [`cy.stub()`](https://on.cypress.io/stub) on `window.fetch`** control the *application*. Use a spy to check the arguments the application passed to `fetch`, and a stub to return a response you build yourself and resolve when you choose. Both need `cy.visit({ onBeforeLoad })` so the spy or stub is in place before any application code runs.

See individual spec files in the [cypress/e2e](cypress/e2e) folder.

Spec | Description
--- | ---
[spy-on-fetch-spec.cy.js](cypress/e2e/spy-on-fetch-spec.cy.js) | Lets calls go through to the server, and observes them with [`cy.spy()`](https://on.cypress.io/spy) on `window.fetch`
[stub-fetch-spec.cy.js](cypress/e2e/stub-fetch-spec.cy.js) | Stubs `fetch` calls both ways: with [`cy.intercept()`](https://on.cypress.io/intercept) at the network layer, and by replacing `window.fetch` with [`cy.stub()`](https://on.cypress.io/stub)
[control-clock-spec.cy.js](cypress/e2e/control-clock-spec.cy.js) | **Bonus:** shows how to "speed-up" the application's 30-second polling by controlling time with [`cy.clock()`](https://on.cypress.io/clock) and [`cy.tick()`](https://on.cypress.io/tick)

## Controlling the response

Stubbing the network makes the awkward cases testable. A slow response is hard to reproduce against a fast development server, but easy to request:

```js
cy.intercept('/favorite-fruits', {
  body: [],
  delay: 1000,
})

cy.visit('/')
cy.get('.loader').should('be.visible')
// once the network call finishes, the loader goes away
cy.get('.loader').should('not.exist')
```

Failures work the same way. Set the `statusCode` and any headers the application reads, then assert on the message your users would see. See the "when request fails" test in [stub-fetch-spec.cy.js](cypress/e2e/stub-fetch-spec.cy.js).

## A note on `experimentalFetchPolyfill`

Older versions of this recipe set `experimentalFetchPolyfill: true`, which removed `window.fetch` so the application would fall back to `XMLHttpRequest` — back when that was the only protocol Cypress could intercept. That option was removed in Cypress 12 and is no longer needed or recognized. If you find it in a config of your own, delete it: `cy.intercept` already handles `fetch`.

For many more `cy.intercept` examples, see the [stubbing-spying__intercept](../stubbing-spying__intercept) recipe.
