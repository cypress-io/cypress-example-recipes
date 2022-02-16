# add custom command in TypeScript
> Write your own Cypress commands using TypeScript

In this recipe we do not use `tsconfig.json` file, thus we need to specify additional command types using `/// <reference ...>` commands, like this:

```js
// cypress/e2e/spec.ts
/// <reference path="../support/index.d.ts" />
```

![IntelliSense for custom command cy.dataCy](images/data-cy.png)

See [cypress/support/e2e.ts](cypress/support/e2e.ts) and [cypress/support/index.d.ts](cypress/support/index.d.ts).
