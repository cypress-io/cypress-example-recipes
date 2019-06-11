# bootstrapping-your-app
> Shows how end-to-end tests can inject data into the application

- Use [`cy.visit()`](https://on.cypress.io/visit) `onBeforeLoad` callback.
- Start your application with test data.
- Stub an XHR to seed with test data.
- Wait on an XHR to finish.

See [cypress/integration/bootstrapping_your_app_spec.js](cypress/integration/bootstrapping_your_app_spec.js) for two solutions.

## 1. Injecting object into `window`

In [bootstrap.hbs](bootstrap.hbs) the application renders into the page an object stored in `window._bootstrappedData`. The end-to-end tests against `/bootstrap.html` check the default data and also inject their own data us [`cy.visit() onBeforeLoad`](https://on.cypress.io/visit) callback.

## 2. Mocking data returned by XHR call

In [xhr.hbs](xhr.hbs) the application makes a separate call to get the data to display. The end-to-end tests can stub the call and inject an object loaded from the fixture file [cypress/fixtures/bootstrap.json](cypress/fixtures/bootstrap.json)

## Development

1. Start the local server

```bash
npm start
```

This servers a page at `http://localhost:7070/bootstrap.html` and another example page at `http://localhost:7070/xhr.html`

2. Open Cypress GUI

```bash
npm run cypress:open
```

**tip**: to start both the local server and open Cypress GUI at once use (useful for development)

```bash
npm run dev
```
