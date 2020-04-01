# Stubbing `window.fetch`
> Work around inability to control network requests that use `window.fetch` [#95][issue]

You can spy and stub `window.fetch` directly, or, to recreate the same [Network support](https://on.cypress.io/network-requests) experience, remove `window.fetch` completely and let your application fall back to `XMLHttpRequest` protocol. If the application does NOT have fallback mechanism, then the Cypress tests can provide it using a polyfill.

See individual spec files in [cypress/integration](cypress/integration) folder.

Spec | Description
--- | ---
[spy-on-fetch-spec.js](cypress/integration/spy-on-fetch-spec.js) | Observes calls the application makes using `window.fetch` via [`cy.spy()`](https://on.cypress.io/spy)
[stub-fetch-spec.js](cypress/integration/stub-fetch-spec.js) | Replaces `window.fetch` with a stubbed method via [`cy.stub()`](https://on.cypress.io/stub) the tests can control
[polyfill-fetch-from-tests-spec.js](cypress/integration/polyfill-fetch-from-tests-spec.js) | Removes `window.fetch` method and replaces it with a polyfill based on XMLHttpRequest
[control-clock-spec.js](cypress/integration/control-clock-spec.js) | **Bonus:** shows how to "speed-up" application to make Ajax calls by controlling time using [`cy.clock()`](https://on.cypress.io/clock) and [`cy.tick()`](https://on.cypress.io/tick)

## Deleting `fetch`

Until issue [#95][issue] is implemented, if your application uses `fetch` protocol to make Ajax requests, Cypress cannot see or stub these network calls. To quickly check what requests the web application is making, open DevTools Network tab and check the "type" column. If the type shows `xhr`, Cypress can see it. If the type says `fetch`, Cypress cannot intercept it yet.

![Ajax type](images/type.png)

**Tip:** if the "type" column is not there, add it by right-clicking on any column and checking "Type" entry.

![Add type column to Network tab](images/add-type-column.png)

You can delete `window.fetch` during individual visit, or for every loaded window.

### Delete in `cy.visit`

You can delete `window.fetch` when calling `cy.visit`, which in most libraries drops back to using XHR

```javascript
cy.visit('/', {
  onBeforeLoad (win) {
    delete win.fetch
  },
})
```

### Delete on every window load

You can register a callback to execute on each `window:load`

```javascript
Cypress.on('window:before:load', (win) => {
  delete win.fetch
})
```

[issue]: https://github.com/cypress-io/cypress/issues/95
