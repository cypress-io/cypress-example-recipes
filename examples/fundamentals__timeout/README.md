# Test timeout

The example shows how to stop a test if it takes too long to execute, similar to [Mocha's timeout](https://mochajs.org/#test-level) option. See [cypress/integration/spec.js](cypress/integration/spec.js)

```js
// this test fails after two seconds due to timeout
it('does not finish long tests', () => {
  testTimeout(2 * 1000)
  cy.wait(10 * 1000)
})
```

![Test is too long](images/test-is-too-long.png)
