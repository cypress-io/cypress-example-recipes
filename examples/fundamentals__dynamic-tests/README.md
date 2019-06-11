# Dynamic tests

You can generate tests from the data you have, see [cypress/integration/spec.js](cypress/integration/spec.js)

- run same test against different viewport resolutions
- run same test against different sub-domains of your site
- Generate tests based on the fetched data

## Dynamic data

File [cypress/integration/dynamic-spec.js](cypress/integration/dynamic-spec.js) shows that sometimes the data might be dynamic and come from external source. You cannot ask for this kind of data _from the test_ itself, since it is too late. There are two workarounds:

1. you can fetch data using a script that runs _before_ Cypress starts. Save the results as a JSON file and load data using `require`. This has an advantage that the data does not change while running the tests, making debugging simpler. See suite called "generated from fixture" for an example.
2. you can fetch the dynamic data before the tests and save as a local variable or context property, then have multiple tests assert against dynamic data items. See suite called "dynamic users" for example.
