# Typescript with Webpack

This is an example showing TypeScript tests with Cypress using Webpack. See Cypress' [TypeScript Support](https://on.cypress.io/typescript-support) docs for more details.

- Uses [webpack](https://github.com/webpack/webpack) to transpile TypeScript tests via [@cypress/webpack-preprocessor](https://github.com/cypress-io/cypress-webpack-preprocessor)
- Lints TypeScript spec code against Cypress type definitions

See:
- [webpack.config.js](webpack.config.js)
- [cypress/plugins/index.js](cypress/plugins/index.js)
- [example test](cypress/integration/spec.ts)

## Commands

The E2E tests should run in Cypress right away. There are few other commands configured in this example recipe as a demonstration.

- `npm run build` runs Webpack to convert spec TS file into `out.js`
- `npm run lint` lints TypeScript specs using [tslint](https://palantir.github.io/tslint) and then TypeScript compiler to type check.
