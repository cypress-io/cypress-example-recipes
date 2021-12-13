# cypress-module-api
> Run Cypress via its module API

Cypress provides a Node module in addition to its CLI commands.

See [module API documentation](https://on.cypress.io/module-api)

```js
require('cypress').run({
  // options
}).then(testResults => {
  // rerun failing specs
  // or email test report
  // or post it on Slack
  // ...
})
```

## Example

In this recipe, execute `npm run cypress:run` script which calls [e2e-tests.js](e2e-tests.js) that finds all spec files in [cypress/e2e](cypress/e2e), sorts them by the last modified timestamp and runs them using Cypress one by one.

For example, if I add a comment to `second-spec.cy.js`, then it will be executed first

```
npm run cypress:run

Running last modified spec first
---------------------------------------------------
filename                              time
------------------------------------  -------------
./cypress/e2e/second-spec.cy.js  1555069051000
./cypress/e2e/third-spec.cy.js   1555067795000
./cypress/e2e/first-spec.cy.js   1555067777000

...
Cypress output for each spec file
...


Test run summary
---------------------------------------
spec            tests  passes  failures
--------------  -----  ------  --------
second-spec.cy.js  1      1       0
third-spec.cy.js   1      1       0
first-spec.cy.js   1      1       0
```

**Note:** this only uses the file system modified time, thus does not work with files checked out from a Git repository - they all will have the same modified timestamp.
