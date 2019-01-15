# Recipes [![CircleCI](https://circleci.com/gh/cypress-io/cypress-example-recipes/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-example-recipes/tree/master) [![Travis CI](https://travis-ci.org/cypress-io/cypress-example-recipes.svg?branch=master)](https://travis-ci.org/cypress-io/cypress-example-recipes) [![renovate-app badge][renovate-badge]][renovate-app]

This repo contains various recipes for testing common scenarios using Cypress.

Recipe | Category | Description
--- | --- | ---
[Node Modules](#node-modules) | Fundamentals | Import your own node modules
[Single Sign On](#single-sign-on) | Logging In | Log in across multiple servers or providers
[HTML Web Forms](#html-web-forms) | Logging In | Log in with a basic HTML form
[XHR Web Forms](#xhr-web-forms) | Logging In | Log in using an XHR
[CSRF Tokens](#csrf-tokens) | Logging In | Log in with a required CSRF token
[Tab Handling and Links](#tab-handling-and-links) | Testing the DOM | Links that open in a new tab
[Hover and Hidden Elements](#hover-and-hidden-elements) | Testing the DOM | Test hidden elements requiring hover
[Form Interactions](#form-interactions) | Testing the DOM | Test form elements like input type `range`
[Drag and Drop](#drag-and-drop) | Testing the DOM | Use `.trigger()` to test drag and drop
[Typescript with Browserify](#typescript-with-browserify) | Preprocessors | Add typescript support with browserify
[Typescript with Webpack](#typescript-with-webpack) | Preprocessors | Add typescript support with webpack
[Application Actions](#application-actions) | Blogs | Application actions are a replacement for Page Objects
[Direct Control of AngularJS](#direct-control-of-angularjs) | Blogs | Bypass the DOM and control AngularJS
[E2E API Testing](#e2e-api-testing) | Blogs | Run your API Tests with a GUI
[E2E Snapshots](#e2e-snapshots) | Blogs | End-to-End Snapshot Testing
[Element Coverage](#element-coverage) | Blogs | Track elements covered by tests
[Codepen.io Testing](#codepen-testing) | Blogs | Test a HyperApp Codepen demo
[Testing Redux Store](#testing-redux-store) | Blogs | Test an application that uses Redux data store
[Vue + Vuex + REST Testing](#vue--vuex--rest-testing) | Blogs | Test an application that uses central data store
[Stubbing Functions](#stubbing-functions) | Stubbing, Spying | Use `cy.stub()` to test function calls
[Stubbing `window.fetch`](#stubbing-windowfetch) | Stubbing, Spying | Use `cy.stub()` to control fetch requests
[Stubbing methods called on `window`](#stubbing-methods-called-on-window) | Stubbing, Spying | Use `cy.stub()` for methods called on `window`
[Stubbing Google Analytics](#stubbing-google-analytics) | Stubbing, Spying | Use `cy.stub()` to test Google Analytics calls
[Application Code](#application-code) | Unit Testing | Import and test your own application code
[React with Enzyme](#react-with-enzyme) | Unit Testing | Test your React components in isolation
[File Upload in React](#file-upload-in-react) | Unit Testing | Test file upload in React app
[Adding Chai Assertions](#adding-chai-assertions) | Extending Cypress | Add new or custom chai assertions
[Bootstrapping your App](#bootstrapping-your-app) | Server Communication | Seed your application with test data
[Seeding your Database in Node](#seeding-your-database-in-node) | Server Communication | Seed your database with test data
[Environment variables](#environment-variables) | Fundamentals | Passing environment variables to tests

## Overview

- This repo is structured similar to how other "Monorepos" work.
- Each [`example project`](./examples) has it's own Cypress configuration, tests, backend and frontend assets.
- Each of these [`example projects`](./examples) share a single "root" Cypress that is installed in the root `node_modules` folder.
- This structure looks different from normal projects, but its the easiest way to manage multiple projects without installing Cypress independently for each one.

## Installation

```bash
## install all dependencies
npm install
```

## Opening Cypress GUI

```bash
cd ./examples/testing-dom__drag-drop
# start local server
npm start &
# and open Cypress GUI
npm run cypress:open
```

## Running from the CLI

Same as running Cypress GUI but with `cypress run` command (and any CLI arguments)

```bash
cd ./examples/testing-dom__drag-drop
# start local server
npm start &
# run Cypress tests headlessly
npm run cypress:run

### runs all example projects in specific browser
### similar to cypress run --browser <name>
npm run cypress:run -- --browser chrome

### sends test results, videos, screenshots
### to Cypress dashboard
npm run cypress:run -- --record
```

## Recipes

### [Node Modules](./examples/fundamentals__node-modules)

- Import ES2015 modules.
- Require CommonJS modules.
- Organize reusable utility functions.
- Import 3rd party `node_modules`.

### [Single Sign On](./examples/logging-in__single-sign-on)

- Login when authentication is done on a 3rd party server.
- Parse tokens using [`cy.request()`](https://on.cypress.io/request).
- Manually set tokens on local storage.
- Map external hosts and point to local servers.

### [HTML Web Forms](./examples/logging-in__html-web-forms)

- Test a standard `username/password` HTML form.
- Test errors submitting invalid data.
- Test unauthenticated redirects.
- Authenticate users with cookies.
- Create a custom `cy.login()` test command.
- Bypass needing to use your actual UI.
- Increase speed of testing with [`cy.request()`](https://on.cypress.io/request).

### [XHR Web Forms](./examples/logging-in__xhr-web-forms)

- Test an AJAX backed `username/password` form.
- Test errors submitting invalid data.
- Stub JSON based XHR requests.
- Stub application functions.
- Create a custom `cy.login()` test command.
- Bypass needing to use your actual UI.
- Increase speed of testing with [`cy.request()`](https://on.cypress.io/request).

### [CSRF Tokens](./examples/logging-in__csrf-tokens)

- Use [`cy.request()`](https://on.cypress.io/request) to get around CSRF protections.
- Parse CSRF tokens out of HTML.
- Parse CSRF tokens out of response headers.
- Expose CSRF via a route.
- Disable CSRF when not in production.

### [Tab Handling and Links](./examples/testing-dom__tab-handling-links)

- Test anchor links opening in new tabs: `<a target="_blank">`.
- Test anchor links that link to external domains: `<a href="...">`.
- Prevent content from opening in a new tab.
- Request external content that would open in a new tab using [`cy.request()`](https://on.cypress.io/request).
- Speed up tests by reducing loading times.

### [Hover and Hidden Elements](./examples/testing-dom__hover-hidden-elements)

- Interact with elements that are hidden by CSS.
- Use [`.invoke()`](https://on.cypress.io/invoke) and [`.trigger()`](https://on.cypress.io/trigger) to simulate hovering.
- Trigger `mouseover`, `mouseout`, `mouseenter`, `mouseleave` events.
Get around the lack of a `.hover()` command.

### [Form Interactions](./examples/testing-dom__form-interactions)

- Use [`.invoke()`](https://on.cypress.io/invoke) and [`.trigger()`](https://on.cypress.io/trigger) to test a range input (slider).

### [Drag and Drop](./examples/testing-dom__drag-drop)

- Use [`.trigger()`](https://on.cypress.io/trigger) to test drag-n-drop that uses mouse events.
- Use [`.trigger()`](https://on.cypress.io/trigger) to test drag-n-drop that uses drag events.

### [Typescript with Browserify](./examples/preprocessors__typescript-browserify)

- Use [`@cypress/browserify-preprocessor`](https://github.com/cypress-io/cypress-browserify-preprocessor) to write Cypress tests in Typescript

### [Typescript with Webpack](./examples/preprocessors__typescript-webpack)

- Use [`@cypress/webpack-preprocessor`](https://github.com/cypress-io/cypress-webpack-preprocessor) to write Cypress tests in Typescript
- Lint TypeScript spec code against Cypress type definitions

### [Application Actions](./examples/blogs__application-actions)

- Invoke methods on the application's model object
- Avoid code duplication and need to create page object hierarchy
- Run e2e very quickly by skipping UI unless testing that specific UI feature

### [Direct Control of AngularJS](./examples/blogs__direct-control-angular)

- [Blog article written here](https://www.cypress.io/blog/2017/11/15/Control-Angular-Application-From-E2E-Tests)
- Programmatically control AngularJS
- Bypass the DOM, update scopes directly
- Create custom command for controlling services

### [E2E API Testing](./examples/blogs__e2e-api-testing)

- [Blog article written here](https://www.cypress.io/blog/2017/11/07/Add-GUI-to-Your-E2E-API-Tests)
- Use `cy.request()` to perform API Testing
- Use the Cypress GUI to help debug requests

### [E2E Snapshots](./examples/blogs__e2e-snapshots)

- Blog post [End-to-End Snapshot Testing](https://www.cypress.io/blog/2018/01/16/end-to-end-snapshot-testing/)
- Adding `.snapshot()` command by requiring 3rd party module
- Capturing and saving snapshots of primitive values
- Testing central data Vuex store using snapshots
- Making assertions against a DOM element with `cy.get('...').snapshot()`

### [Codepen Testing](./examples/blogs__codepen-demo)

- [Blog post](https://www.cypress.io/blog/2017/12/05/testing-apps-hosted-on-codepen/)
- Load Codepen and get around iframe security restrictions.
- Use [`cy.request()`](https://on.cypress.io/api/request) to load a document into test iframe.
- Test [HyperApp.js](https://hyperapp.js.org/) application through the DOM and through actions.

### [Element Coverage](./examples/blogs__element-coverage)

- Blog post [Element coverage](https://www.cypress.io/blog/2018/12/20/element-coverage/)
- Overwrite several built-in Cypress commands like `cy.type` and `cy.click`
- Draw elements after the tests finish

### [Testing Redux Store](./examples/blogs__testing-redux-store)

- control application via DOM and check that Redux store has been properly updated
- drive application by dispatching Redux actions
- use Redux actions directly from tests
- load initial Redux state from a fixture file

### [Vue + Vuex + REST Testing](./examples/blogs__vue-vuex-rest)

- [Blog post](https://www.cypress.io/blog/2017/11/28/testing-vue-web-application-with-vuex-data-store-and-rest-backend/)
- Test a [Vue.js](https://vuejs.org/) web application that uses central data store
- Mock REST calls to the server
- Dispatch actions to the [Vuex](https://vuex.vuejs.org/en/) store
- Test text file upload

### [Stubbing Functions](./examples/stubbing-spying__functions)

- Use [`cy.stub()`](https://on.cypress.io/stub) to stub dependencies in a unit test.
- Handle promises returned by stubbed functions.
- Handle callbacks in stubbed functions.

### [Stubbing `window.fetch`](./examples/stubbing-spying__window-fetch)

- Use [`cy.spy()`](https://on.cypress.io/spy) to verify the behavior of a function.
- Use [`cy.stub()`](https://on.cypress.io/stub) to verify and control the behavior of a function.
- Use [`cy.clock()`](https://on.cypress.io/clock) and [`cy.tick()`](https://on.cypress.io/tick) to control time.
- Stub `window.fetch` to control server responses.
- Replace `window.fetch` with a polyfill that uses XHR and is loaded only for tests

### [Stubbing methods called on `window`](./examples/stubbing-spying__window)

- Use [`cy.spy()`](https://on.cypress.io/stub) to test `window.open` behavior.

### [Stubbing Google Analytics](./examples/stubbing-spying__google-analytics)

- Use [`blacklistHosts`](https://on.cypress.io/configuration#Browser) to block Google Analytics from receiving requests.
- Use [`cy.stub()`](https://on.cypress.io/stub) to verify that `window.ga(...)` was called with the correct arguments

### [Application Code](./examples/unit-testing__application-code)

- Unit test your own application code libraries.
- Import modules using ES2015.
- Test simple math functions.
- Test the canonical *fizzbuzz* test.
- Automatically retry assertion until a given property inside an object:
  * is added or deleted
  * has expected value

### [React with Enzyme](./examples/unit-testing__react-enzyme)

- Unit test a React JSX Component using [Enzyme](http://airbnb.io/enzyme/).
- Import `enzyme` from `node_modules`.
- Extend chai assertions with [`chai-enzyme`](https://github.com/producthunt/chai-enzyme).

### [File Upload in React](./examples/file-upload-react)

- Passing synthetic test file to upload via an [`.trigger('change')`](https://on.cypress.io/trigger) event
- Stub remote server using [`cy.route()`](https://on.cypress.io/route)
- Alternatively stub `axios.post` method using [`cy.stub()`](https://on.cypress.io/stub)

### [Adding Chai Assertions](./examples/extending-cypress__chai-assertions)

- Extend [`chai`](http://chaijs.com/) with the [`chai-date-string`](http://chaijs.com/plugins/chai-date-string/) assertion plugin.
- Extend [`chai`](http://chaijs.com/) with the [`chai-colors`](http://chaijs.com/plugins/chai-colors/) assertion plugin.
- Globally extend [`chai`](http://chaijs.com/) for all specs.

### [Bootstrapping your App](./examples/server-communication__bootstrapping-your-app)

- Use [`cy.visit()`](https://on.cypress.io/visit) `onBeforeLoad` callback.
- Start your application with test data.
- Stub an XHR to seed with test data.
- Wait on an XHR to finish.

### [Seeding your Database in Node](./examples/server-communication__seeding-database-in-node)

- Use [`cy.task()`](https://on.cypress.io/task) to communicate with node via the `pluginsFile`.
- Seed your database with test data.
- Wrap your `pluginsFile` so you can require files that use ES modules (`import`/`export`).

### [Environment Variables](./examples/server-communication__env-variables)

- Pass values via `env` object in `cypress.json`.
- Pass any variable that starts with `CYPRESS_`.
- Extract any other variable from `process.env` using `cypress/plugins/index.js` callback.

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
