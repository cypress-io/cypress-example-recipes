# Assertion counting

See the application in [index.html](index.html) that shows `window.confirm` on click

![Window confirm](images/confirm.gif)

The [cypress/integration/spec.js](cypress/integration/spec.js) shows various ways the tests can ensure the async assertions finish before the test finishes. The last test shows how to use [cypress-expect-n-assertions](https://github.com/bahmutov/cypress-expect-n-assertions) to automatically wait for declared number of assertions to run before finishing the test.

```js
import { plan } from 'cypress-expect-n-assertions'
it('waits for planned number of assertion to run', () => {
  plan(1)
  cy.visit('index.html')

  cy.on('window:confirm', (message) => {
    expect(message).to.equal('Are you sure?')
  })

  cy.get('#click').click()
})
```

![Automatic waiting for expected number of assertions to run](images/plan.gif)
