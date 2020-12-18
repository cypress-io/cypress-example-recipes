# visit-2nd-domain
> Visiting two different domains from two different tests

![Screenshot](img/screenshot.png)

## using task

The tests in [using-task-spec.js](cypress/integration/using-task-spec.js) store the intermediate URL in the plugins process.

The first test visits the first domain `https://www.cypress.io/`, finds link to Cypress Test Runner's GitHub repo and saves the `href` in the plugins process by using [cy.task](https://on.cypress.io/task).

The second test gets the URL from the plugins process using [cy.task](https://on.cypress.io/task) and calls `cy.visit(<URL>)` and then confirms the GitHub page opens.

## using file

The tests in [using-file-spec.js](cypress/integration/using-file-spec.js) save the extracted URL in a local JSON file.
