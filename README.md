# Recipes [![Circle CI](https://circleci.com/gh/cypress-io/cypress-example-recipes.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-example-recipes) [![Travis CI](https://travis-ci.org/cypress-io/cypress-example-recipes.svg?branch=master)](https://travis-ci.org/cypress-io/cypress-example-recipes)

[![Greenkeeper badge](https://badges.greenkeeper.io/cypress-io/cypress-example-recipes.svg)](https://greenkeeper.io/)

This repo contains various recipes for testing common scenarios using Cypress.

Recipe | Category | Description
--- | --- | ---
[Node Modules](#Node-Modules) | Fundamentals | Import your own node modules
[Single Sign On](#Single-Sign-On) | Logging In | Log in across multiple servers or providers
[HTML Web Forms](#HTML-Web-Forms) | Logging In | Log in with a basic HTML form
[XHR Web Forms](#XHR-Web-Forms) | Logging In | Log in using an XHR
[CSRF Tokens](#CSRF-Tokens) | Logging In | Log in with a required CSRF token
[Tab Handling and Links](#Tab-Handling-and-Links) | Testing the DOM | Links that open in a new tab
[Hover and Hidden Elements](#Hover-and-Hidden-Elements) | Testing the DOM | Test hidden elements requiring hover
[Form Interactions](#Form-Interactions) | Testing the DOM | Test form elements like input type `range`
[Drag 'n Drop](#Drag-n-Drop) | Testing the DOM | Use `.trigger()` to test drag and drop
[Stubbing Functions](#Stubbing-Functions) | Stubbing, Spying | Use `cy.stub()` to test function calls
[Stubbing `window.fetch`](#Stubbing-window-fetch) | Stubbing, Spying | Use `cy.stub()` to control fetch requests
[Application Code](#Application-Code) | Unit Testing | Import and test your own application code
[React with Enzyme](#React-with-Enzyme) | Unit Testing | Test your react components in isolation
[Adding Chai Assertions](#Adding-Chai-Assertions) | Extending Cypress | Add new or custom chai assertions
[Bootstrapping your App](#Bootstrapping-your-App) | Server Communication | Seed your application with test data

## Overview

- This repo is structured similar to how other "Monorepos" work.
- Each [`example project`](./examples) has it's own Cypress configuration, tests, backend and frontend assets.
- Each of these [`example projects`](./examples) share a single "root" Cypress that is installed in the root `node_modules` folder.
- This structure looks different from normal projects, but its the easiest way to manage multiple projects without installing Cypress independently for each one.

## Installation

```bash
## install all dependencies
npm install

## this will call 'npm start' on
## each example project's package.json
## which boots all of the webservers
npm start

## if you want to make modifications
## to the node server code and have
## the servers automatically restart
npm run dev
```

## Opening Cypress GUI

```bash
## this opens the cypress test runner
## in the GUI mode. because this project
## is a monorepo - we've opened the test
## runner in 'global' mode.
##
## so to run a specific project you'll
## need to manually add the folder to Cypress.
npm run cypress:open

## alternatively, to open a specific
## example without running in global mode
cd ./examples/drag-n-drop
npm run cypress:open
```

## Running from the CLI

```bash
## runs all example projects and
## exits with the total number of
## failures across all projects
npm run cypress:run

## switch the browser to chrome instead
## of the default headless Electron browser
npm run cypress:run:chrome

## alternatively, to run a specific
## example without running all projects
cd ./examples/drag-n-drop
npm run cypress:run
```

## Recipes

### [Node Modules](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/es2015_commonjs_modules_spec.js)

- Import ES2015 modules.
- Require CommonJS modules.
- Organize reusable utility functions.
- Import 3rd party `node_modules`.

### [Single Sign On](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/logging_in_single_sign_on_spec.js)

- Login when authentication is done on a 3rd party server.
- Parse tokens using [`cy.request()`](https://on.cypress.io/
https://on.cypress.io/request).
- Manually set tokens on local storage.
- Map external hosts and point to local servers.

### [HTML Web Forms](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/logging_in_html_web_form_spec.js)

- Test a standard `username/password` HTML form.
- Test errors submitting invalid data.
- Test unauthenticated redirects.
- Authenticate users with cookies.
- Create a custom `cy.login()` test command.
- Bypass needing to use your actual UI.
- Increase speed of testing with [`cy.request()`](https://on.cypress.io/
https://on.cypress.io/request).

### [XHR Web Forms](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/logging_in_xhr_web_form_spec.js)

- Test an AJAX backed `username/password` form.
- Test errors submitting invalid data.
- Stub JSON based XHR requests.
- Stub application functions.
- Create a custom `cy.login()` test command.
- Bypass needing to use your actual UI.
- Increase speed of testing with [`cy.request()`](https://on.cypress.io/
https://on.cypress.io/request).

### [CSRF Tokens](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/logging_in_csrf_tokens_spec.js)

- Use [`cy.request()`](https://on.cypress.io/
https://on.cypress.io/request) to get around CSRF protections.
- Parse CSRF tokens out of HTML.
- Parse CSRF tokens out of response headers.
- Expose CSRF via a route.
- Disable CSRF when not in production.

### [Tab Handling and Links](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/tab_handling_anchor_links_spec.js)

- Test anchor links opening in new tabs: `<a target="_blank">`.
- Test anchor links that link to external domains: `<a href="...">`.
- Prevent content from opening in a new tab.
- Request external content that would open in a new tab using [`cy.request()`](https://on.cypress.io/
https://on.cypress.io/request).
- Speed up tests by reducing loading times.

### [Hover and Hidden Elements](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/hover_hidden_elements_spec.js)

- Interact with elements that are hidden by CSS.
- Use [`.invoke()`](https://on.cypress.io/invoke) and [`.trigger()`](https://on.cypress.io/
https://on.cypress.io/trigger) to simulate hovering.
- Trigger `mouseover`, `mouseout`, `mouseenter`, `mouseleave` events.
Get around the lack of a `.hover()` command.

### [Form Interactions](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/form_interactions_spec.js)

- Use [`.invoke()`](https://on.cypress.io/invoke) and [`.trigger()`](https://on.cypress.io/
https://on.cypress.io/trigger) to test a range input (slider).

### [Drag and Drop](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/drag_n_drop_spec.js)

- Use [`.trigger()`](https://on.cypress.io/
https://on.cypress.io/trigger) to test drag-n-drop that uses mouse events.
- Use [`.trigger()`](https://on.cypress.io/
https://on.cypress.io/trigger) to test drag-n-drop that uses drag events.

### [Stubbing Functions](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/unit_test_stubbing_dependencies_spec.js)

- Use [`cy.stub()`](https://on.cypress.io/stub) to stub dependencies in a unit test.
- Handle promises returned by stubbed functions.
- Handle callbacks in stubbed functions.

### [Stubbing `window.fetch`](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/spy_stub_clock_spec.js)

- Use [`cy.spy()`](https://on.cypress.io/
https://on.cypress.io/spy) to verify the behavior of a function.
- Use [`cy.stub()`](https://on.cypress.io/stub) to verify and control the behavior of a function.
- Use [`cy.clock()`](https://on.cypress.io/
https://on.cypress.io/clock) and [`cy.tick()`](https://on.cypress.io/
https://on.cypress.io/tick) to control time.
- Stub `window.fetch` to control server responses.


### [Application Code](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/unit_test_application_code_spec.js)

- Unit test your own application code libraries.
- Import modules using ES2015.
- Test simple math functions.
- Test the canonical *fizzbuzz* test.

### [React with Enzyme](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/unit_test_react_enzyme_spec.js)

- Unit test a React JSX Component using [Enzyme](http://airbnb.io/enzyme/).
- Import `enzyme` from `node_modules`.
- Extend chai assertions with [`chai-enzyme`](https://github.com/producthunt/chai-enzyme).

### [Adding Chai Assertions](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/extending_chai_assertion_plugins_spec.js)

- Extend [`chai`](http://chaijs.com/) with the [`chai-date-string`](http://chaijs.com/plugins/chai-date-string/) assertion plugin.
- Extend [`chai`](http://chaijs.com/) with the [`chai-colors`](http://chaijs.com/plugins/chai-colors/) assertion plugin.
- Globally extend [`chai`](http://chaijs.com/) for all specs.

### [Bootstrapping your App](https://github.com/cypress-io/cypress-example-recipes/blob/master/cypress/integration/bootstrapping_app_test_data_spec.js)

- Use [`cy.visit()`](https://on.cypress.io/
https://on.cypress.io/visit) `onBeforeLoad` callback.
- Start your application with test data.
- Stub an XHR to seed with test data.
- Wait on an XHR to finish.
