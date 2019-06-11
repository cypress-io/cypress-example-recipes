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

In this recipe, execute `npm run cypress:run` script which calls [e2e-tests.js](e2e-tests.js) that finds all spec files in [cypress/integration](cypress/integration), sorts them by the last modified timestamp and runs them using Cypress one by one.

For example, if I add a comment to `second-spec.js`, then it will be executed first

```
npm run cypress:run

Running last modified spec first
---------------------------------------------------
filename                              time
------------------------------------  -------------
./cypress/integration/second-spec.js  1555069051000
./cypress/integration/third-spec.js   1555067795000
./cypress/integration/first-spec.js   1555067777000

...
Cypress output for each spec file
...


Test run summary
---------------------------------------
spec            tests  passes  failures
--------------  -----  ------  --------
second-spec.js  1      1       0
third-spec.js   1      1       0
first-spec.js   1      1       0
```

**Note:** this only uses the file system modified time, thus does not work with files checked out from a Git repository - they all will have the same modified timestamp.
