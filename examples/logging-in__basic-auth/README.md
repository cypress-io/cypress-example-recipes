# logging-in__basic-auth
Shows how to visit the page protected by the [Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)

The static site from [public folder](./public) is protected by the basic authentication, see [server.js](./server.js).

The [cypress/integration/spec.js](./cypress/integration/spec.js) shows how to pass the username and the password when calling [cy.visit](https://on.cypress.io/visit) and [cy.request](https://on.cypress.io/request) commands.
