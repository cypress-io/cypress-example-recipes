# Interacting with iframes

The page [index.html](index.html) contains an iframe, and we want our tests to work with that iframe. This recipe shows how to:

- Access elements inside an iframe coming from a 3rd party domain
- Spy on `window.fetch` calls from the iframe
- Stub network calls coming from the iframe

Read the companion blog post [Working with iframes in Cypress](https://cypress.io/blog/2020/02/12/working-with-iframes-in-cypress/)

Spec | Description
--- | ---
[first-spec.js](cypress/integration/first-spec.js) | Loads the [index.html](index.html)
[button-spec.js](cypress/integration/button-spec.js) | Clicks the button inside an iframe and checks the text
[single-its-spec.js](cypress/integration/single-its-spec.js) | Uses a single Cypress command to retry while iframe is loading
[custom-command-spec.js](cypress/integration/custom-command-spec.js) | Moves iframe access into a reusable common custom command
[spy-on-fetch-spec.js](cypress/integration/spy-on-fetch-spec.js) | Accesses `window` inside the iframe and spies on `fetch` calls
[xhr-spec.js](cypress/integration/xhr-spec.js) | Shows how to spy and stub network calls the iframe is making
[plugin-spec.js](cypress/integration/plugin-spec.js) | Uses [cypress-iframe](https://gitlab.com/kgroat/cypress-iframe) plugin to work elements inside an iframe

## Notes

In [cypress.json](cypress.json) we are using [test retries](https://on.cypress.io/test-retries) to get through an occasional (rare) flake, see issue [#558](https://github.com/cypress-io/cypress-example-recipes/issues/558)
