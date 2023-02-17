# Testing Vue + Vuex + REST application

Testing Vue + Vuex + REST TodoMVC using Cypress.

## Blog Post

[The blog post](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/)

![Application organization](img/vue-vuex-rest.png)

## Shows how to

Spec files are in [cypress/e2e](cypress/e2e) folder

- test application through the GUI in [ui-spec.cy.js](cypress/e2e/ui-spec.cy.js)
- mock REST calls to the server
- test application through the Vuex store in [store-spec.cy.js](cypress/e2e/store-spec.cy.js)
- test application through REST calls in [api-spec.cy.js](cypress/e2e/api-spec.cy.js)
- test text file upload

## Script commands

- `npm run reset:db` resets [data.json](data.json) to have empty list of todos

## Speed test

Spec file [cypress/e2e/speed-spec.cy.js](cypress/e2e/speed-spec.cy.js) shows how to get test and command timings.

![Speed spec](img/speed-spec.png)
