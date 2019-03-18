# Unit testing React code

A little React [greeting.jsx](greeting.jsx) component is tested (inside Cypress test runner) using

- [cypress/integration/enzyme-spec.js](cypress/integration/enzyme-spec.js) using [Enzyme](https://airbnb.io/enzyme/)
  * import `enzyme` from `node_modules`.
  * extend chai assertions with [`chai-enzyme`](https://github.com/producthunt/chai-enzyme).
- [cypress/integration/react-testing-library-spec.js](cypress/integration/react-testing-library-spec.js) using [react-testing-library](https://github.com/kentcdodds/react-testing-library)
