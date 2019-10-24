# logging-in-single-sign-on
> Login when authentication is done on a 3rd party server.

The app server [app_server.js](app_server.js) runs on port 7074 and the auth server [auth_server.js](auth_server.js) runs on port 7075. File [cypress/integration/logging-in-single-sign-on-spec.js](cypress/integration/logging-in-single-sign-on-spec.js) describes the overall authentication flow and implements tests that follow it.

The tests show how to:

- Login when authentication is done on a 3rd party server.
- Automatically parse tokens using [`cy.request()`](https://on.cypress.io/request) and set as cookies
- Manually set tokens on local storage (similar to SPA flow).
- Map external hosts like `auth.corp.com:7075` and point to local servers `127.0.0.1:7075` in [cypress.json](cypress.json)
- Get the authentication token just once and set it before each test (should make tests faster)

**tip** to start the server and run Cypress GUI use script `npm run dev`

Highly recommended: watch video ["Organizing Tests, Logging In, Controlling State"](https://www.youtube.com/watch?v=5XQOK0v_YRE)

## Debugging

To see debug logs from the server, run the server with `DEBUG=sso`
