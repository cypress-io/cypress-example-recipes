# Offline network test

- [offline-spec.cy.js](cypress/e2e/offline-spec.cy.js) simulates an offline network connection and tests how the application handles it

![Network status test](images/offline.gif)

## How it simulates being offline

A browser going offline changes two separate things, and a test has to simulate both:

- **what the application believes about connectivity** — `window.navigator.onLine` plus the `online` and `offline` events. Defining `onLine` as an own property on `window.navigator` shadows the getter inherited from `Navigator.prototype`, and dispatching the matching event lets the application re-render.
- **the requests themselves failing** — [`cy.intercept()`](https://on.cypress.io/intercept). Where an entire test is offline, the static `{ forceNetworkError: true }` response is enough. Where connectivity has to flip mid-test, a request handler that calls [`req.destroy()`](https://on.cypress.io/intercept#Request-events) while a flag is set gives you both states from a single route.

Neither touches the browser's real network stack, so these tests run in Chrome, Firefox, Edge, WebKit, and Electron alike.

## Why not the Chrome Debugger Protocol?

An earlier version of this recipe went offline for real, with `Network.emulateNetworkConditions` over the Chrome Debugger Protocol. [Chromium 97 fixed a bug](https://bugs.chromium.org/p/chromium/issues/detail?id=1139824) so that WebSockets finally honor emulated network conditions — including the WebSocket the Cypress runner uses to talk to the Cypress server. Going offline that way now disconnects the runner and hangs the test run. See [issue #772](https://github.com/cypress-io/cypress-example-recipes/issues/772).

One trade-off comes with the approach used here: because the requests are failed at the proxy rather than at the network interface, the browser still makes them. A test can assert that the application *attempted* a request and handled the failure, which is what matters for the application's own behavior, but it cannot assert that nothing left the machine.
