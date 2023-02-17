# Test timeout

The example shows how to stop a test if it takes too long to execute, similar to [Mocha's timeout](https://mochajs.org/#test-level) option. The timeout function is in [cypress/e2e/timeout.cy.js](cypress/e2e/timeout.cy.js).

You can set timeout inside the test only, see [cypress/e2e/spec.cy.js](cypress/e2e/spec.cy.js)

```js
// this test fails after two seconds due to timeout
it('does not finish long tests', () => {
  testTimeout(2 * 1000)
  cy.wait(10 * 1000)
})
```

![Test is too long](images/test-is-too-long.png)

You can set global timeout that applies to every test, see [cypress/e2e/all-tests-spec.cy.js](cypress/e2e/all-tests-spec.cy.js) using `Cypress.on('test:before:run' ...` event
