# Unit testing React code

A little React [greeting.jsx](greeting.jsx) component is tested (inside Cypress test runner) using:

- [cypress/integration/enzyme-spec.js](cypress/integration/enzyme-spec.js) using [Enzyme](https://airbnb.io/enzyme/)
  * import `enzyme` from `node_modules`.
  * extend chai assertions with [`chai-enzyme`](https://github.com/producthunt/chai-enzyme).
- [cypress/integration/react-testing-library-spec.js](cypress/integration/react-testing-library-spec.js) using [react-testing-library](https://github.com/kentcdodds/react-testing-library)
- [cypress/component/cypress-react-unit-test-spec.js](cypress/component/cypress-react-unit-test-spec.js) using [cypress-react-unit-test](https://github.com/bahmutov/cypress-react-unit-test)

### cypress-react-unit-test example

⚠️ This is an experimental feature that uses `"experimentalComponentTesting": true` flag in [cypress.json](cypress.json) and requires Cypress v4.5.0+. See [on.cypress.io/experimental](https://on.cypress.io/experimental) for more details.

The screenshot below shows how [cypress-react-unit-test](https://github.com/bahmutov/cypress-react-unit-test) mounts a React component as "mini" web application.

![Testing React component using cypress-react-unit-test](images/button-click.png)

Name | Description
--- | ---
[cypress-react-unit-test-spec.js](cypress/component/cypress-react-unit-test-spec.js) | Simple button click
[counter-spec.js](cypress/component/counter-spec.js) | Testing a counter component that uses React hook

Read [Sliding Down the Testing Pyramid](https://www.cypress.io/blog/2018/04/02/sliding-down-the-testing-pyramid/) for more details about testing individual components by mounting them in the Cypress test runner's iframe.
