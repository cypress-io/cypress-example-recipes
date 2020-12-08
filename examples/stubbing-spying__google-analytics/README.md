# Stubbing Google Analytics

## Stubbing `window.ga` method

The first example in [google-analytics-stubbing.js](cypress/integration/google-analytics-stubbing.js) blocks all requests to domain `www.google-analytics.com`. Even though we are preventing the actual `GA` script from loading, we can still stub the `window.ga` object and ensure its being called correctly.

- Use [`cy.intercept`](https://on.cypress.io/intercept) to block Google Analytics from receiving requests.
- Use [`cy.stub()`](https://on.cypress.io/stub) to verify that `window.ga(...)` was called with the correct arguments

The next screenshot shows how the script is being blocked with a `503` server response code.

![Request blocked using cy.intercept](images/blocked.png)

You can see the intercepted network call and the `window.ga` stub calls in the Command Log

![Method calls](images/actions.png)
