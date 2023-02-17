# a11y example

This demo shows the [cypress-axe](https://github.com/avanslaars/cypress-axe) plugin which can run the [Axe-core](https://github.com/dequelabs/axe-core) library against the webpage to check if the page follows accessibility practices.

The tests are in [cypress/e2e](cypress/e2e) folder.

- The [passing-spec.cy.js](cypress/e2e/passing-spec.cy.js) loads local [index.html](index.html) with high contrast text, which passes A11y checks
- The [failing-spec.cy.js](cypress/e2e/failing-spec.cy.js) loads local [index-bad.html](index-bad.html) with low contrast text, failing the checks

![Failing check](images/failing.png)

**Note:** the actual failures are printed in the DevTools console

## Additional resources

- Watch this [live pair programming session](https://youtu.be/IADSsClWVtA) that shows a Gatsby.js site being tested using `cypress-axe`
