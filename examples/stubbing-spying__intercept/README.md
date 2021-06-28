# Stubbing application requests using [cy.intercept](https://on.cypress.io/intercept)

- [control-clock-spec.js](cypress/integration/control-clock-spec.js) shows how to reply with different responses to an ajax request
- [count-spec.js](cypress/integration/count-spec.js) uses `cy.intercept` and `cy.spy|cy.stub` combination to count the number of intercepted network calls
- [form-spec.js](./cypress/integration/form-spec.js) shows how to stub form submission request and verify the submitted form fields (`application/x-www-form-urlencoded` or `multipart/form-data`)
- [headers-spec.js](./cypress/integration/header-spec.js) adds a custom header to the outgoing request. Note that this request header won't be shown by the browser's Network tab, since the request has already left the browser.
- [html-css-spec.js](cypress/integration/html-css-spec.js) modifies the page itself and changes the CSS requested by the page.
- [image-spec.js](cypress/integration/image-spec.js) shows how to spy and stub static resources like images
- [jsonp-spec.js](cypress/integration/jsonp-spec.js) shows how to spy on or stub a JSONP data request
- [loading-element-spec.js](./cypress/integration/loading-element-spec.js) shows how to test the loading element that appears while the app is fetching the data
- [matching-spec.js](cypress/integration/matching-spec.js) shows how the same request can match multiple `cy.intercept` matchers
- [ping-spec.js](./cypress/integration/ping-spec.js) shows how to confirm `<a ping="/track">` really is making a POST request
- [redirect-spec.js](cypress/integration/redirect-spec.js) shows how to spy on a redirect, and how to stub the redirect response from the server to avoid loading a second domain, for example
- [repeat-spec.js](cypress/integration/repeat-spec.js) stress tests GET and POST calls by running the tests multiple times, as described in [Retry, Rerun, Repeat](https://www.cypress.io/blog/2020/12/03/retry-rerun-repeat/)
- [spy-on-fetch-spec.js](cypress/integration/spy-on-fetch-spec.js) shows how to spy on the `fetch` call
- [stub-fetch-spec.js](cypress/integration/stub-fetch-spec.js) shows how to stub `fetch` calls from the application, event depending on the object sent
- [stubbed-api-spec.js](cypress/integration/stubbed-api-spec.js) shows how stubbed requests work without any backend API
- [times-spec.js](cypress/integration/times-spec.js) shows how to use the `cy.intercept` "times" option
- [glob-matching-intercept-url.spec.js](cypress/integration/glob-matching-intercept-url.spec.js) shows how glob matching urls works
- [intercept-force404.spec.js](cypress/integration/intercept-force404.spec) shows how to implement an equivalent of `force404` (a feature of `cy.route()`) with `cy.intercept()`
- [intercept-events.spec.js](cypress/integration/) shows how to use intercept events
- [middleware-intercept.spec.js](cypress/integration/middleware-intercept.spec.js) shows how to set middleware handlers that apply before all others

For more `cy.intercept` examples and tips read the [Cypress cy.intercept Problems](https://glebbahmutov.com/blog/cypress-intercept-problems/) blog post
