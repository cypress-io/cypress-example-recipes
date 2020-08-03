# add-custom-command
> Write your own Cypress commands

## Adding custom commands

You write Cypress custom command, for example for selecting DOM elements by `data-cy` attribute like this:

```js
/**
 * Adds custom command "cy.dataCy" to the global "cy" object
 *
 * @example cy.dataCy('greeting')
 */
Cypress.Commands.add('dataCy', (value) => cy.get(`[data-cy=${value}]`))
```

Yet, TypeScript compiler and IntelliSense do not understand that you have added a new method to the global `cy` object.

![Custom command not found](images/custom-command-not-found.png)

To add the new method to the global `cy` you need to add a separate TypeScript file like [cypress/support/index.d.ts](cypress/support/index.d.ts) and list the new `cy` methods there.

```ts
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to select DOM element by data-cy attribute.
     * @example cy.dataCy('greeting')
    */
    dataCy(value: string): Chainable<Element>
  }
}
```

From your JavaScript spec file, use a special triple slash directive to load the new file by relative path:

```js
/// <reference path="../support/index.d.ts" />
```

And the TypeScript and IntelliSense should be happy

![Custom command help working](images/custom-command-found.png)

## 3rd party modules

As an example this spec includes 3rd party module [cypress-wait-until](https://github.com/NoriSte/cypress-wait-until). This module ships with its own TypeScript definition, which allows `cy.waitUntil` to work. Load the types from the `support/index.d.ts` file

```js
// load the global Cypress types
/// <reference types="cypress" />
// load the 3rd party command definition for cy.waitUntil()
/// <reference types="cypress-wait-until" />
```

![IntelliSense for cy.waitUntil command](images/wait-until.png)

**Tip:** use JSDoc comments to document your commands.

## Async commands

A custom command can call an async function from the application, the resolved value will be automatically yielded to the next command or assertion in the test. See [cypress/integration/async-command.js](cypress/integration/async-command.js) file.

![Async add custom command](images/async-add.png)

## More info

- [Cypress custom commands](https://on.cypress.io/custom-commands)
