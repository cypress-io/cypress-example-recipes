# Cypress events

For more details, see [Cypress catalogue of events](https://on.cypress.io/catalog-of-events)

- [cypress-on-spec.cy.js](./cypress/e2e/cypress-on-spec.cy.js) shows how we can add a property to every `window` object before the app load using `Cypress.on('window:before:load', ...)` event listener
- [cy-on-spec.cy.js](./cypress/e2e/cy-on-spec.cy.js) shows how to add a property to every `window` object before the app loads using `cy.on('window:before:load', ...)` event listener.

## Stubbing an analytics library

Use this pattern to test that your application reports to an analytics service — Google Analytics, Segment, Amplitude, or your own in-house tracker. The application under test calls a global object:

```js
// in app.js
Analytics.sendEvent('click', 'button#click-me')
```

Because `window:before:load` fires before any of the page's scripts run, the test can put a stub in place of that global and then assert on the calls:

```js
Cypress.on('window:before:load', (win) => {
  win.Analytics = {
    sendEvent: cy.stub().as('sendEvent'),
  }
})

cy.get('@sendEvent').should('be.calledOnceWithExactly', 'click', 'button#click-me')
```

The stub is a [Sinon](https://sinonjs.org/) stub, so when you only care about some of the arguments you can relax the others with a matcher rather than asserting on an exact value:

```js
cy.get('@sendEvent').should('be.calledOnceWith',
  Cypress.sinon.match.string, 'button#click-me')
```

Stubbing the global also keeps the real analytics script from loading, so your tests do not depend on a third-party CDN being reachable, and your test runs never pollute a production analytics property with junk data.

## See also

- [cy.stub()](https://on.cypress.io/stub) and [cy.spy()](https://on.cypress.io/spy)
- Recipe [Stubbing Functions](../stubbing-spying__functions) for stubbing and spying on methods generally
- Recipe [Stubbing application requests](../stubbing-spying__intercept) if you would rather let the analytics library load and assert on the network requests it makes with [cy.intercept()](https://on.cypress.io/intercept)
