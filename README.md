# Recipes [![Circle CI](https://circleci.com/gh/cypress-io/cypress-example-recipes.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-example-recipes) [![Travis CI](https://travis-ci.org/cypress-io/cypress-example-recipes.svg?branch=master)](https://travis-ci.org/cypress-io/cypress-example-recipes)

This repo contains various recipes for testing common scenarios in your application using Cypress.

# Contents

- [Overview](#overview)
- [Installation](#installation)
- [Recipes](#recipes)
  - [ES2015 / CommonJS Modules](#es2015--commonjs-modules)
  - [Unit Test - Application Code](#unit-test---application-code)
  - [Unit Test - React w/Enzyme](#unit-test---react-wenzyme)
  - [Unit Test - Stubbing Dependencies](#unit-test---stubbing-dependencies)
  - [Logging In - HTML Web Form](#logging-in---html-web-form)
  - [Logging In - XHR Web Form](#logging-in---xhr-web-form)
  - [Logging In - CSRF Tokens](#logging-in---csrf-tokens)
  - [Logging In - Single Sign On](#logging-in---single-sign-on)
  - [Extending Chai with Assertion Plugins](#extending-chai-with-assertion-plugins)
  - [Tab Handling and Anchor Links](#tab-handling-and-anchor-links)
  - [Dealing with Hover and Hidden Elements](#dealing-with-hover-and-hidden-elements)
  - [Bootstrapping your App with Test Data](#bootstrapping-your-app-with-test-data)
  - [Controlling Behavior with Spies, Stubs, and Clocks](#controlling-behavior-with-spies-stubs-and-clocks)
  - [Form Interactions](#form-interactions)
  - [Drag 'n Drop](#drag-n-drop)

# Overview

- this is still a WIP, and we'll be adding recipes daily
- all of the tests are found in [`cypress/integration`](./cypress/integration)
- we boot a separate node server per recipe
- each [`example`](./examples) has all of its own backend and frontend assets

# Installation

```bash
## install all dependencies
npm install

## boot the various node servers
## to use in the tests
npm start

## or if you want to make modifications
## to the node server code and have
## the servers automatically restart
npm run dev
```

# Recipes

### [ES2015 / CommonJS Modules](./cypress/integration/es2015_commonjs_modules_spec.js)

This recipe shows you how to:

- Import ES2015 modules
- Require CommonJS modules
- Organize reusable utility functions
- Import 3rd party `node_modules`

***

### [Unit Test - Application Code](./cypress/integration/unit_test_application_code_spec.js)

This recipe shows you how to:

- Unit test your own application code libs
- Import modules using ES2015
- Write simple math functions
- Implement the canonical *fizzbuzz* test

***

### [Unit Test - React w/Enzyme](./cypress/integration/unit_test_react_enzyme_spec.js)

This recipe shows you how to:

- Unit test a React JSX Component
- Import `enzyme` from `node_modules`
- Extend chai assertions with `chai-enzyme`

***

### [Unit Test - Stubbing Dependencies](./cypress/integration/unit_test_stubbing_dependencies_spec.js)

This recipe shows you how to:

- Use `cy.stub` to stub dependencies in a unit test
- Handle promises returned by stubbed functions
- Handle callbacks in stubbed functions

***

### [Logging In - HTML Web Form](./cypress/integration/logging_in_html_web_form_spec.js)

This recipe shows you how to:

- Test a standard `username/password` HTML form
- Test errors submitting invalid data
- Test unauthenticated redirects
- Authenticate users with cookies
- Create a custom `login` command
- Bypass needing to use your actual UI
- Increase testing performance with `cy.request`

***

### [Logging In - XHR Web Form](./cypress/integration/logging_in_xhr_web_form_spec.js)

This recipe shows you how to:

- Test an AJAX backed `username/password` form
- Test errors submitting invalid data
- Stub JSON based XHR requests
- Stub application functions
- Create a custom `login` command
- Bypass needing to use your actual UI
- Increase testing performance with `cy.request`

***

### [Logging In - CSRF Tokens](./cypress/integration/logging_in_csrf_tokens_spec.js)

This recipe shows you how to:

- Use `cy.request` to get around CSRF protections
- Parse CSRF tokens out of HTML
- Parse CSRF tokens out of response headers
- Expose CSRF via a route
- Disable CSRF when not in production

***

### [Logging In - Single Sign On](./cypress/integration/logging_in_single_sign_on_spec.js)

This recipe shows you how to:

- Login when authentication is done on a 3rd party server
- Parse tokens using `cy.request`
- Manually set tokens on local storage
- Map external hosts and point to local servers

***

### [Extending Chai with Assertion Plugins](./cypress/integration/extending_chai_assertion_plugins_spec.js)

This recipe shows you how to:

- Extend `chai` with the `chai-date-string` assertion plugin
- Extend `chai` with the `chai-colors` assertion plugin
- Globally extend `chai` for all specs

***

### [Tab Handling and Anchor Links](./cypress/integration/tab_handling_anchor_links_spec.js)

This recipe shows you how to:

- Test `<a target="_blank">` elements
- Test `<a href="...">` elements which link to external domains
- Prevent content from opening in a new tab
- Request external content that would open in a new tab
- Improve testing performance by reducing loading times

***

### [Dealing with Hover and Hidden Elements](./cypress/integration/hover_hidden_elements.js)

This recipe shows you how to:

- Interact with elements which are hidden by CSS
- Trigger `mouseover`, `mouseout`, `mouseenter`, `mouseleave` events
- Get around the lack of a `cy.hover` command

***

### [Bootstrapping your App with Test Data](./cypress/integration/bootstrapping_app_test_data_spec.js)

This recipe shows you how to:

- Use `cy.visit` `onBeforeLoad` callback
- Start your application with test data
- Stub an XHR to seed with test data
- Wait on an XHR to finish

***

### [Controlling Behavior with Spies, Stubs, and Clocks](./cypress/integration/spy_stub_clock_spec.js)

This recipe shows you how to:

- Use `cy.spy` to verify the behavior of a function
- Use `cy.stub` to verify and control the behavior of a function
- Use `cy.clock` to control time
- Stub `window.fetch` to control server responses

***

### [Form Interactions](./cypress/integration/form_interactions_spec.js)

This recipe shows you how to:

- Use `cy.invoke` and `cy.trigger` to test a range input (slider)

***

### [Drag 'n Drop](./cypress/integration/drag_n_drop_spec.js)

This recipe shows you how to:

- Use `cy.trigger` to test drag-n-drop that uses mouse events
- Use `cy.trigger` to test drag-n-drop that uses drag events

***
