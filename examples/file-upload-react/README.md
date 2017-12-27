# file-upload-react

Tests React component that uploads a file. React source is in [index.html](index.html), tests in [cypress/integration/spec.js](cypress/integration/spec.js)

Key concepts

- Passing synthetic test file to upload via an [`.trigger('change')`](https://on.cypress.io/trigger) event
- Stub remote server using [`.route()`](https://on.cypress.io/route)
- Alternatively stub `axios.post` method using [`.stub()`](https://on.cypress.io/stub)
