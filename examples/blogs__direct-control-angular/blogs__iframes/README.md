# Interacting with iframes

The page [index.html](index.html) contains an iframe, and we want our tests to work with that iframe. This recipe shows how to:

- Access elements inside an iframe coming from a 3rd party domain
- Spy on `window.fetch` calls from the iframe
- Stub network calls coming from the iframe

Read the companion blog post [Working with iframes in Cypress](https://cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/)

Spec | Description
--- | ---
[first-spec.cy.js](cypress/e2e/first-spec.cy.js) | Loads the [index.html](index.html)
[button-spec.cy.js](cypress/e2e/button-spec.cy.js) | Clicks the button inside an iframe and checks the text
[single-its-spec.cy.js](cypress/e2e/single-its-spec.cy.js) | Uses a single Cypress command to retry while iframe is loading
[custom-command-spec.cy.js](cypress/e2e/custom-command-spec.cy.js) | Moves iframe access into a reusable common custom command
[spy-on-fetch-spec.cy.js](cypress/e2e/spy-on-fetch-spec.cy.js) | Accesses `window` inside the iframe and spies on `fetch` calls
[xhr-spec.cy.js](cypress/e2e/xhr-spec.cy.js) | Shows how to spy and stub network calls the iframe is making
[plugin-spec.cy.js](cypress/e2e/plugin-spec.cy.js) | Uses [cypress-iframe](https://gitlab.com/kgroat/cypress-iframe) plugin to work elements inside an iframe

## Notes

In [cypress.config.js](cypress.config.js) we are using [test retries](https://on.cypress.io/test-retries) to get through an occasional (rare) flake, see issue [#558](https://github.com/cypress-io/cypress-example-recipes/issues/558)
