# module-api-wrap
> Run Cypress via its module API by parsing "cypress run" arguments

If you would like to wrap Cypress and post-process test run results, then you probably want to parse the command line using the same logic as `cypress run` itself.

In principle:

```js
const cypress = require('cypress')
// assuming you call the wrapper script like
// node ./run-me cypress run ... (rest of Cypress arguments)
cypress.cli.parseRunArguments(process.argv.slice(2))
  .then(cypress.run)
```

See [package.json](package.json) and See [run-me.js](run-me.js) for the full example.
