# Assertions checking network request and response

This recipe shows how to spy on a network request and assert the request data and the response

[cypress/integration/spec.js](cypress/integration/spec.js) runs multiple assertions against an XHR object

![Multiple assertions](images/assertions.png)

[cypress/integration/spok-spec.js](cypress/integration/spok-spec.js) asserts multiple values and schema properties using [cy-spok](https://github.com/bahmutov/cy-spok) plugin built on top of [spok](https://github.com/thlorenz/spok)

![Spok assertions](images/spok.png)

## See also

- [Cypress network guide](https://on.cypress.io/network-requests)
- Cypress Testing Workshop [XHR chapter](https://github.com/cypress-io/testing-workshop-cypress#xhr)
