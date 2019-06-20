# logging-in__using-app-code
> Example of logging in using application code

Application copied from [../logging-in__jwt](../logging-in__jwt) example.

This example shows how you can use your own application code to log in. The "normal" application logs in in [src/_services/user.service.js](src/_services/user.service.js) given username and password. From our [cypress/integration/spec.js](cypress/integration/spec.js) we can import this service and use [`cy.wrap`](https://on.cypress.io/wrap) to wait for the returned promise to resolve before continuing with the test.

![Passing test](images/login.png)

**note:** in order to import the login service, we need to bundle the spec code using same Webpack bundler configuration as the application code. We do it by using [cypress-webpack-preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor), see [cypress/plugins/index.js](cypress/plugins/index.js)
