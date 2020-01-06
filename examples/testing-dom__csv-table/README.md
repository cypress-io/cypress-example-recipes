# CSV and table recipe
> Loads CSV file and checks HTML table to have the text content matching the loaded CSV records

Uses [neat-csv](https://github.com/sindresorhus/neat-csv) to parse the loaded CSV text into records.

## Tests

- [spec.js](cypress/integration/spec.js) loads the CSV file using [`cy.readFile`](https://on.cypress.io/readfile), parses the text into list of objects, then goes through the rows of the table element comparing cell text content to the records.

![Table test](images/rows.png)
