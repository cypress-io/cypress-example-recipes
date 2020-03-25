# visit-2nd-domain
> Visiting two different domains from two different tests

![Screenshot](img/screenshot.png)

The first test visits the first domain `https://www.cypress.io/`, finds link to Cypress Test Runner's GitHub repo and saves the `href` in the plugins process by using [cy.task](https://on.cypress.io/task).

The second test gets the URL from the plugins process using [cy.task](https://on.cypress.io/task) and calls `cy.visit(<URL>)` and then confirms the GitHub page opens.
