# pass-value-between-specs
> Passing a value from a test in the first spec to a test in the second spec

## using task

The tests in [first-spec.js](cypress/integration/first-spec.js) store a Todo item retrieved from the API. The Todo item is stored in the [plugin file](./cypress/plugins/index.js) which is the background process continuously running while the browser relaunches for every spec.

```js
// cypress/integration/first-spec.js
const url = 'https://jsonplaceholder.cypress.io/todos/1'
cy.request(url).its('body').then(todo => {
  cy.task('setItem', {
    name: 'todo',
    value: todo
  })
})
```

The [second spec](./cypress/integration/second-spec.js) that always runs _after_ the first one retrieves the saved item

```js
// cypress/integration/second-spec.js
cy.task('getItem', 'todo')
  .should('deep.equal', expectedTodo)
```

The console log messages from the plugin file show the saved and retrieved items

```text
  Running:  first-spec.js  (1 of 2)

  First spec
setting todo
    ✓ 1 - stores the value (442ms)
returning item todo
    ✓ 2 - has the saved item in the next test

  2 passing (469ms)


  Running:  second-spec.js  (2 of 2)

  Second spec
returning item todo
    ✓ has the saved item from the first spec (51ms)

  1 passing (68ms)
```

## Warning ⚠️

Saving an item in the plugin file only works as expected if the specs run in the expected order on the same machine. If you are using parallelization with `--parallel` flag the order of specs is determined by their historical timings, and the specs are split amongst all participating machines. Thus the specs might run in the wrong order, or only the second spec might execute on the machine, breaking the test.

## See also

- recipe ["Visiting 2nd domain"](https://github.com/cypress-io/cypress-example-recipes#server-communication)
