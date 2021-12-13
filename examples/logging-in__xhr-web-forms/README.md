# logging-in-xhr-web-form

> Log into the server using XHR from end-to-end tests

See the login XHR code in [login.hbs](login.hbs)

![Tests](images/tests.png)

- Test an AJAX backed `username/password` form.
- Test errors submitting invalid data.
- Stub JSON based XHR requests.
- Stub application functions.
- Create a custom `cy.login()` test command.
- Bypass needing to use your actual UI.
- Increase speed of testing with [`cy.request()`](https://on.cypress.io/request).

Test files in [cypress/e2e](cypress/e2e) folder show:

- in [logging-in-xhr-web-form-spec.cy.js](cypress/e2e/logging-in-xhr-web-form-spec.cy.js) how to log in using the UI
- in [logging-via-request-spec.cy.js](cypress/e2e/logging-via-request-spec.cy.js) how to login using [`cy.request`](https://on.cypress.io/request)
- in [custom-command-spec.cy.js](cypress/e2e/custom-command-spec.cy.js) how to write a custom `cy.loginByJSON` command to abstract the quick login using `cy.request`
- in [slow-login-spec.cy.js](cypress/e2e/slow-login-spec.cy.js) how to login just once and then reuse the session cookie in each test

**tip** to start the server and run Cypress GUI use script `npm run dev`

Highly recommended: watch video ["Organizing Tests, Logging In, Controlling State"](https://www.youtube.com/watch?v=5XQOK0v_YRE)
