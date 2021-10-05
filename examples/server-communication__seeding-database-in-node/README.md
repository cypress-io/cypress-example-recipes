# Seeding Your Database in Node

This recipe demonstrates:

* Seeding your database with node.js using [`cy.task()`](https://on.cypress.io/task)

## Seeding your database

If you use Node.js for your app, you can re-use your app code to help set up and manipulate data for your tests. In this example, we utilize [`cy.task()`](https://on.cypress.io/task) to connect with node via the `setupNodeEvents` function to re-use the `server/db.js` and seed the database.
