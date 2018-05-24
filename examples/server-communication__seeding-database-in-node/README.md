# Seeding Your Database in Node

This recipe demonstrates two things:

* Seeding your database with node.js using [`cy.task()`](https://on.cypress.io/task)
* Using ES modules `import`/`export` syntax in your plugins

## Seeding your database

If you use Node.js for your app, you can re-use your app code to help set up and manipulate data for your tests. In this example, we utilize [`cy.task()`](https://on.cypress.io/task) to connect with node via the `pluginsFile` to re-use the `server/db.js` and seed the database.

## Using ES modules in plugins

You can not use `import`/`export` directly in your `pluginsFile`, but you can wrap it so that any subsequently required files can utilize `import`/`export` and any other syntax that is configured in your `.babelrc`.
