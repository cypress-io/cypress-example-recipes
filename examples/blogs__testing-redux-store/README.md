# Testing Redux Store

Testing Redux store using Cypress.

## Shows how to

- control application via DOM and check that Redux store has been properly updated
- drive application by dispatching Redux actions
- use Redux actions directly from tests
- load initial Redux state from a fixture file
- use automatic user function retries with [cypress-pipe](https://github.com/NicholasBoll/cypress-pipe#readme)
- use snapshot testing via [meinaart/cypress-plugin-snapshots](https://github.com/meinaart/cypress-plugin-snapshots) plugin

## Application

The example TodoMVC application in this folder was copied from [https://github.com/reduxjs/redux/tree/master/examples/todomvc](https://github.com/reduxjs/redux/tree/master/examples/todomvc) on November 2018.
