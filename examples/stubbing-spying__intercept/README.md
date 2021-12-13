# Stubbing application requests using [cy.intercept](https://on.cypress.io/intercept)

- [control-clock-spec.cy.js](cypress/e2e/control-clock-spec.cy.js) shows how to reply with different responses to an ajax request
- [count-spec.cy.js](cypress/e2e/count-spec.cy.js) uses `cy.intercept` and `cy.spy|cy.stub` combination to count the number of intercepted network calls
- [form-spec.cy.js](./cypress/e2e/form-spec.cy.js) shows how to stub form submission request and verify the submitted form fields (`application/x-www-form-urlencoded` or `multipart/form-data`)
- [headers-spec.cy.js](./cypress/e2e/header-spec.cy.js) adds a custom header to the outgoing request. Note that this request header won't be shown by the browser's Network tab, since the request has already left the browser.
- [html-css-spec.cy.js](cypress/e2e/html-css-spec.cy.js) modifies the page itself and changes the CSS requested by the page.
- [image-spec.cy.js](cypress/e2e/image-spec.cy.js) shows how to spy and stub static resources like images
- [jsonp-spec.cy.js](cypress/e2e/jsonp-spec.cy.js) shows how to spy on or stub a JSONP data request
- [loading-element-spec.cy.js](./cypress/e2e/loading-element-spec.cy.js) shows how to test the loading element that appears while the app is fetching the data
- [matching-spec.cy.js](cypress/e2e/matching-spec.cy.js) shows how the same request can match multiple `cy.intercept` matchers
- [ping-spec.cy.js](./cypress/e2e/ping-spec.cy.js) shows how to confirm `<a ping="/track">` really is making a POST request
- [redirect-spec.cy.js](cypress/e2e/redirect-spec.cy.js) shows how to spy on a redirect, and how to stub the redirect response from the server to avoid loading a second domain, for example
- [repeat-spec.cy.js](cypress/e2e/repeat-spec.cy.js) stress tests GET and POST calls by running the tests multiple times, as described in [Retry, Rerun, Repeat](https://www.cypress.io/blog/2020/12/03/retry-rerun-repeat/)
- [spy-on-fetch-spec.cy.js](cypress/e2e/spy-on-fetch-spec.cy.js) shows how to spy on the `fetch` call
- [stub-fetch-spec.cy.js](cypress/e2e/stub-fetch-spec.cy.js) shows how to stub `fetch` calls from the application, event depending on the object sent
- [stubbed-api-spec.cy.js](cypress/e2e/stubbed-api-spec.cy.js) shows how stubbed requests work without any backend API
- [times-spec.cy.js](cypress/e2e/times-spec.cy.js) shows how to use the `cy.intercept` "times" option
- [glob-matching-intercept-url.spec.cy.js](cypress/e2e/glob-matching-intercept-url.spec.cy.js) shows how glob matching urls works
- [intercept-force404.spec.cy.js](cypress/e2e/intercept-force404.spec.cy.js) shows how to implement an equivalent of `force404` (a feature of `cy.route()`) with `cy.intercept()`
- [intercept-events.spec.cy.js](cypress/e2e/intercept-events.spec.cy.js) shows how to use intercept events
- [middleware-intercept.spec.cy.js](cypress/e2e/middleware-intercept.spec.cy.js) shows how to set middleware handlers that apply before all others

For more `cy.intercept` examples and tips read the [Cypress cy.intercept Problems](https://glebbahmutov.com/blog/cypress-intercept-problems/) blog post
