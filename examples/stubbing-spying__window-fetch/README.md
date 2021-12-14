# Stubbing `window.fetch`
> Work around inability to control network requests that use `window.fetch` [#95][issue]

You can spy and stub `window.fetch` directly, or, to recreate the same [Network support](https://on.cypress.io/network-requests) experience, remove `window.fetch` completely and let your application fall back to `XMLHttpRequest` protocol. If the application does NOT have fallback mechanism, then the Cypress tests can provide it using a polyfill.

See individual spec files in [cypress/e2e](cypress/e2e) folder.

Spec | Description
--- | ---
[spy-on-fetch-spec.cy.js](cypress/e2e/spy-on-fetch-spec.cy.js) | Observes calls the application makes using `window.fetch` via [`cy.spy()`](https://on.cypress.io/spy)
[stub-fetch-spec.cy.js](cypress/e2e/stub-fetch-spec.cy.js) | Uses Cypress default network stubbing to intercept `fetch` calls from the application
[control-clock-spec.cy.js](cypress/e2e/control-clock-spec.cy.js) | **Bonus:** shows how to "speed-up" application to make Ajax calls by controlling time using [`cy.clock()`](https://on.cypress.io/clock) and [`cy.tick()`](https://on.cypress.io/tick)

## Stubbing `fetch`

Cypress wraps the native XMLHttpRequest object to allow observing and stubbing network requests from the application. It also polyfills the native `window.fetch` method to work via wrapped XMLHttpRequest - this is how we allow network stubbing for applications that use `fetch` calls. See [cypress.config.js](cypress.config.js)

```json
{
  "experimentalFetchPolyfill": true
}
```

In the future we plan to move network stubbing into Cypress' proxy layer, allowing much more powerful and complete network control. Watch issue [#95][issue] for progress.
