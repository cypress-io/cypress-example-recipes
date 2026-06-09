# Server communication: passing environment variables

This recipe shows how to pass [environment variables to your tests](https://on.cypress.io/environment-variables)

- See [package.json](package.json) file which runs Cypress with environment variables set. The variables that start with `CYPRESS_` are extracted automatically. Other variables are copied from `process.env` in the [setupNodeEvents](cypress.config.js) function 
- Additional variables can be passed via `env` object in [cypress.config.js](cypress.config.js)
- Extract any other variable from `process.env` using the `setupNodeEvents` function.
- Uses [dotenv](https://github.com/motdotla/dotenv#readme) package to read the `.env` file in the Cypress configuraton
- Keep secret or private variables server-side and read them in your spec with [`cy.env()`](https://on.cypress.io/env): `cy.env(['ping', 'HOST'])`. Values stay on the server; only the keys you request are returned to the spec.
- Use [`Cypress.expose()`](https://on.cypress.io/expose) (and the `expose` config / `{ expose: {...} }` test/suite override) only for values that are safe to expose everywhere — they are serialized into the config and readable in the browser and across every origin.
