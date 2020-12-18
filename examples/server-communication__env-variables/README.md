# Server communication: passing environment variables

This recipe shows how to pass [environment variables to your tests](https://on.cypress.io/environment-variables)

- See [package.json](package.json) file which runs Cypress with environment variables set. The variables that start with `CYPRESS_` are extracted automatically. Other variables are copied from `process.env` in the script [cypress/plugins/index.js](cypress/plugins/index.js)
- Additional variables can be passed via `env` object in [cypress.json](cypress.json)
- Extract any other variable from `process.env` using `cypress/plugins/index.js` callback.
- Uses [dotenv](https://github.com/motdotla/dotenv#readme) package to read the `.env` file in the plugins file
