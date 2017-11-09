# Recipes [![Circle CI](https://circleci.com/gh/cypress-io/cypress-example-recipes.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-example-recipes) [![Travis CI](https://travis-ci.org/cypress-io/cypress-example-recipes.svg?branch=master)](https://travis-ci.org/cypress-io/cypress-example-recipes)

[![Greenkeeper badge](https://badges.greenkeeper.io/cypress-io/cypress-example-recipes.svg)](https://greenkeeper.io/)

This repo contains various recipes for testing common scenarios using Cypress.

# Contents

- [Overview](#overview)
- [Installation](#installation)
- [Recipes](#recipes)
  - [Logging In - Single Sign On](#logging-in---single-sign-on)
  - [Logging In - HTML Web Form](#logging-in---html-web-form)
  - [Logging In - XHR Web Form](#logging-in---xhr-web-form)
  - [Logging In - CSRF Tokens](#logging-in---csrf-tokens)
  - [Unit Test - Application Code](#unit-test---application-code)
  - [Unit Test - React w/Enzyme](#unit-test---react-wenzyme)
  - [Unit Test - Stubbing Dependencies](#unit-test---stubbing-dependencies)
  - [ES2015 / CommonJS Modules](#es2015--commonjs-modules)
  - [Extending Chai with Assertion Plugins](#extending-chai-with-assertion-plugins)
  - [Tab Handling and Anchor Links](#tab-handling-and-anchor-links)
  - [Dealing with Hover and Hidden Elements](#dealing-with-hover-and-hidden-elements)
  - [Bootstrapping your App with Test Data](#bootstrapping-your-app-with-test-data)
  - [Controlling Behavior with Spies, Stubs, and Clocks](#controlling-behavior-with-spies-stubs-and-clocks)
  - [Form Interactions](#form-interactions)
  - [Drag 'n Drop](#drag-n-drop)

# Overview

- This repo is structured similar to how other "Monorepos" work.
- Each [`example project`](./examples) has it's own Cypress configuration, tests, backend and frontend assets.
- Each of these [`example projects`](./examples) share a single "root" Cypress that is installed in the root `node_modules` folder.
- This structure looks different from normal projects, but its the easiest way to manage multiple projects without installing Cypress independently for each one.

# Installation

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

# Opening Cypress GUI

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

# Running from the CLI

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

# Recipes

### [Logging In - Single Sign On](./examples/logging-in-single-sign-on)

**This recipe shows you how to:**

- Login when authentication is done on a 3rd party server
- Parse tokens using [`cy.request`](https://on.cypress.io/api/request)
- Manually set tokens on local storage
- Map external hosts and point to local servers

***

### [Logging In - HTML Web Form](./examples/logging-in-html-web-form)

**This recipe shows you how to:**

- Test a standard `username/password` HTML form
- Test errors submitting invalid data
- Test unauthenticated redirects
- Authenticate users with cookies
- Create a custom `login` test command
- Bypass needing to use your actual UI
- Increase speed of testing with [`cy.request`](https://on.cypress.io/api/request)

***

### [Logging In - XHR Web Form](./examples/logging-in-xhr-web-form)

**This recipe shows you how to:**

- Test an AJAX backed `username/password` form
- Test errors submitting invalid data
- Stub JSON based XHR requests
- Stub application functions
- Create a custom `login` test command
- Bypass needing to use your actual UI
- Increase speed of testing with [`cy.request`](https://on.cypress.io/api/request)

***

### [Logging In - CSRF Tokens](./examples/logging-in-csrf-tokens)

**This recipe shows you how to:**

- Use [`cy.request`](https://on.cypress.io/api/request) to get around CSRF protections
- Parse CSRF tokens out of HTML
- Parse CSRF tokens out of response headers
- Expose CSRF via a route
- Disable CSRF when not in production

***

### [Unit Test - Application Code](./examples/unit-test-application-code)

**This recipe shows you how to:**

- Unit test your own application code libraries
- Import modules using ES2015
- Test simple math functions
- Test the canonical *fizzbuzz* test

***

### [Unit Test - React w/Enzyme](./examples/unit-test-react-enzyme)

**This recipe shows you how to:**

- Unit test a React JSX Component using [Enzyme](http://airbnb.io/enzyme/)
- Import `enzyme` from `node_modules`
- Extend chai assertions with [`chai-enzyme`](https://github.com/producthunt/chai-enzyme)

***

### [Unit Test - Stubbing Dependencies](./examples/unit-test-stubbing-dependencies)

**This recipe shows you how to:**

- Use [`cy.stub`](https://on.cypress.io/api/stub) to stub dependencies in a unit test
- Handle promises returned by stubbed functions
- Handle callbacks in stubbed functions

***

### [ES2015 / CommonJS Modules](./examples/es2015-commonjs-modules)

**This recipe shows you how to:**

- Import ES2015 modules
- Require CommonJS modules
- Organize reusable utility functions
- Import 3rd party `node_modules`

***

### [Extending Chai with Assertion Plugins](./examples/extending-chai-assertion-plugins)

**This recipe shows you how to:**

- Extend [`chai`](http://chaijs.com/) with the [`chai-date-string`](http://chaijs.com/plugins/chai-date-string/) assertion plugin
- Extend [`chai`](http://chaijs.com/) with the [`chai-colors`](http://chaijs.com/plugins/chai-colors/) assertion plugin
- Globally extend [`chai`](http://chaijs.com/) for all specs

***

### [Tab Handling and Anchor Links](./examples/tab-handling-anchor-links)

**This recipe shows you how to:**

- Test anchor links opening in new tabs: `<a target="-blank">`
- Test anchor links that link to external domains: `<a href="...">`
- Prevent content from opening in a new tab
- Request external content that would open in a new tab
- Speed up tests by reducing loading times

***

### [Dealing with Hover and Hidden Elements](./examples/hover-hidden-elements)

**This recipe shows you how to:**

- Interact with elements which are hidden by CSS
- Use [`.invoke`](https://on.cypress.io/invoke) and [`.trigger`](https://on.cypress.io/trigger) to simulate hovering
- Trigger `mouseover`, `mouseout`, `mouseenter`, `mouseleave` events
- Get around the lack of a `cy.hover` command

***

### [Bootstrapping your App with Test Data](./examples/bootstrapping-your-app)

**This recipe shows you how to:**

- Use [`cy.visit`](https://on.cypress.io/api/visit) `onBeforeLoad` callback
- Start your application with test data
- Stub an XHR to seed with test data
- Wait on an XHR to finish

***

### [Controlling Behavior with Spies, Stubs and Clocks](./examples/spy-stub-clock)

**This recipe shows you how to:**

- Use [`cy.spy`](https://on.cypress.io/spy) to verify the behavior of a function
- Use [`cy.stub`](https://on.cypress.io/stub) to verify and control the behavior of a function
- Use [`cy.clock`](https://on.cypress.io/clock) and [`cy.tick`](https://on.cypress.io/tick) to control time
- Stub `window.fetch` to control server responses

***

### [Form Interactions](./examples/form-interactions)

This recipe shows you how to:

- Use [`.invoke`](https://on.cypress.io/invoke) and [`.trigger`](https://on.cypress.io/trigger) to test a range input (slider)

***

### [Drag 'n Drop](./examples/drag-n-drop)

This recipe shows you how to:

- Use [`.trigger`](https://on.cypress.io/trigger) to test drag-n-drop that uses mouse events
- Use [`.trigger`](https://on.cypress.io/trigger) to test drag-n-drop that uses drag events

***
