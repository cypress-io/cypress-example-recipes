# file-upload-react

Tests React component that uploads a file. React source is in [index.html](index.html), spec files in [cypress/integration](cypress/integration) folder

## Tests

### [spec.js](cypress/integration/spec.js)

- The tests are trying to pass a synthetic test file to upload via an [`.trigger('change')`](https://on.cypress.io/trigger) event passing `File` reference using event property `testFile`. In the source code we try to grab this property before accessing the native file reference (which Cypress cannot set until we can fire the native file upload event)

```js
// application code tries to grab the File reference from "testFile" property
// which is set by the end-to-end Cypress test
const file = e.nativeEvent.testFile || e.nativeEvent.target.files[0]
```

We can confirm that the file gets uploaded by stubbing either XHR request or intercepting the `axios` library method used by the application's code to actually perform the file upload. See the `spec.js` how to:

- Stub remote server using [`cy.route()`](https://on.cypress.io/route)
- Alternatively stub `axios.post` method using [`cy.stub()`](https://on.cypress.io/stub)

### [upload-plugin-spec.js](cypress/integration/upload-plugin-spec.js)

- uses [`cypress-file-upload`](https://github.com/abramenal/cypress-file-upload) for file upload
