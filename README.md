# Recipes

This repo contains various recipes for testing common scenarios in your application using Cypress.

# Contents

- [Overview](#overview)
- [Installation](#installation)
- [Recipes](#recipes)
  - [ES2015 / CommonJS Modules](#recipes)
  - [Unit Testing](#recipes)
  - [Bootstrapping App Data](#recipes)
  - [Dealing with Hover](#recipes)

# Overview

- this is still a WIP, and we'll be adding recipes daily
- all of the tests are found in `cypress/integration`
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

### Unit Test Application Code

***

### [Unit Test React w/Enzyme](./cypress/integration/unit_test_react_enzyme_spec.js)

This recipe shows you how to:

- Unit test a React Component
- Import `enzyme` from `node_modules`
- Extend chai assertions with `chai-enzyme`

***

### Bootstrapping App Data

***

### Dealing with Hover
