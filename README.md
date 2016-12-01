# Recipes [![Circle CI](https://circleci.com/gh/cypress-io/cypress-example-recipes.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-example-recipes) [![Travis CI](https://travis-ci.org/cypress-io/cypress-example-recipes.svg?branch=master)](https://travis-ci.org/cypress-io/cypress-example-recipes)

This repo contains various recipes for testing common scenarios in your application using Cypress.

# Contents

- [Overview](#overview)
- [Installation](#installation)
- [Recipes](#recipes)
  - [ES2015 / CommonJS Modules](#es2015--commonjs-modules)
  - [Unit Test - Application Code](#unit-test---application-code)
  - [Unit Test - React w/Enzyme](#unit-test---react-wenzyme)
  - [Extending Chai with Assertion Plugins](#extending-chai-with-assertion-plugins)
  - [Tab Handling and Anchor Links](#tab-handling-and-anchor-links)

# Overview

- this is still a WIP, and we'll be adding recipes daily
- all of the tests are found in [`cypress/integration`](./cypress/integration)
<!-- - running a single static file server to server static file content -->
<!-- - if a recipe needs a server it is booted separately on a differnet port -->
<!-- - running node server (port: NNNN) for recipe: 'XYZ recipe' -->

# Installation

```bash
## install all dependencies
npm install

## boot the various node servers
## to use in the tests
npm start
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

### [Extending Chai with Assertion Plugins](./cypress/integration/extending_chai_assertion_plugins_spec.js)

This recipe shows you how to:

- Extend `chai` with the `chai-date-string` assertion plugin
- Extend `chai` with the `chai-colors` assertion plugin
- Globally extend `chai` for all specs

***

### [Tab Handling and Anchor Links](./cypress/integration/tab_handling_anchor_links_spec.js)

This recipe shows you how to:

- Test `<a target="_blank">` elements
- Test `<a href="..."> elements which link to external domains
- Prevent content from opening in a new tab
- Request external content that would open in a new tab
- Improve testing performance by reducing loading times

***
