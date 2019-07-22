# Recipes [![CircleCI](https://circleci.com/gh/cypress-io/cypress-example-recipes/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-example-recipes/tree/master) [![Travis CI](https://travis-ci.org/cypress-io/cypress-example-recipes.svg?branch=master)](https://travis-ci.org/cypress-io/cypress-example-recipes) [![Build status](https://ci.appveyor.com/api/projects/status/7p4qkwavheciwbxc/branch/master?svg=true)](https://ci.appveyor.com/project/cypress-io/cypress-example-recipes/branch/master) [![renovate-app badge][renovate-badge]][renovate-app]

> This repo contains various recipes for testing common scenarios using Cypress: [Fundamentals](#fundamentals), [Testing the DOM](#testing-the-dom), [Logging in](#logging-in-recipes), [Preprocessors](#preprocessors), [Blogs](#blogs), [Stubbing and spying](#stubbing-and-spying), [Unit Testing](#unit-testing), [Server Communication](#server-communication)

## Fundamentals

Recipe | Description
--- | ---
[Node Modules](./examples/fundamentals__node-modules) | Import your own node modules
[Environment variables](./examples/server-communication__env-variables) | Passing environment variables to tests
[Dynamic tests](./examples/fundamentals__dynamic-tests) | Create tests dynamically from data
[Fixtures](./examples/fundamentals__fixtures) | Loading single or multiple fixtures
[Adding Chai Assertions](./examples/extending-cypress__chai-assertions) | Add new or custom chai assertions
[Cypress module API](./examples/fundamentals__module-api) | Run Cypress via its module API

## Testing the DOM

Recipe | Description
--- | ---
[Tab Handling and Links](./examples/testing-dom__tab-handling-links) | Links that open in a new tab
[Hover and Hidden Elements](./examples/testing-dom__hover-hidden-elements) | Test hidden elements requiring hover
[Form Interactions](./examples/testing-dom__form-interactions) | Test form elements like input type `range`
[Drag and Drop](./examples/testing-dom__drag-drop) | Use `.trigger()` to test drag and drop
[Shadow DOM](./examples/testing-dom__shadow-dom) | You need to use any of available custom commands
[Waiting for static resource](./examples/testing-dom__wait-for-resource) | Shows how to wait for CSS or any other static resource to load

## Logging in recipes

Recipe | Description
--- | ---
[Single Sign On](./examples/logging-in__single-sign-on) | Log in across multiple servers or providers
[HTML Web Forms](./examples/logging-in__html-web-forms) | Log in with a basic HTML form
[XHR Web Forms](./examples/logging-in__xhr-web-forms) | Log in using an XHR
[CSRF Tokens](./examples/logging-in__csrf-tokens) | Log in with a required CSRF token
[Json Web Tokens (JWT)](./examples/logging-in__jwt) | Log in using JWT
[Using application code](./examples/logging-in__using-app-code) | Log in by calling the application code

Also see [Authentication plugins](https://on.cypress.io/plugins#authentication) and watch video ["Organizing Tests, Logging In, Controlling State"](https://www.youtube.com/watch?v=5XQOK0v_YRE)

## Preprocessors

Recipe | Description
--- | ---
[grep](./examples/preprocessors__grep) | Filter tests by name using Mocha-like `grep` syntax
[Typescript with Browserify](./examples/preprocessors__typescript-browserify) | Add typescript support with browserify
[Typescript with Webpack](./examples/preprocessors__typescript-webpack) | Add typescript support with webpack

## Blogs

Demo recipes from the blog posts at [www.cypress.io/blog](https://www.cypress.io/blog)

Recipe | Description
--- | ---
[Application Actions](./examples/blogs__application-actions) | Application actions are a replacement for Page Objects
[Direct Control of AngularJS](./examples/blogs__direct-control-angular) | Bypass the DOM and control AngularJS
[E2E API Testing](./examples/blogs__e2e-api-testing) | Run your API Tests with a GUI
[E2E Snapshots](./examples/blogs__e2e-snapshots) | End-to-End Snapshot Testing
[Element Coverage](./examples/blogs__element-coverage) | Track elements covered by tests
[Codepen.io Testing](./examples/blogs__codepen-demo) | Test a HyperApp Codepen demo
[Testing Redux Store](./examples/blogs__testing-redux-store) | Test an application that uses Redux data store
[Vue + Vuex + REST Testing](./examples/blogs__vue-vuex-rest) | Test an application that uses central data store
[A11y Testing](./examples/blogs__a11y) | Accessability testing with [cypress-axe](https://github.com/avanslaars/cypress-axe#readme)

## Stubbing and spying

Recipe | Description
--- | ---
[Stubbing Functions](./examples/stubbing-spying__functions) | Use `cy.spy()` and `cy.stub()` to test function calls
[Stubbing `window.fetch`](./examples/stubbing-spying__window-fetch) | Use `cy.stub()` to control fetch requests
[Stubbing methods called on `window`](./examples/stubbing-spying__window) | Use `cy.stub()` for methods called on `window`
[Stubbing Google Analytics](./examples/stubbing-spying__google-analytics) | Use `cy.stub()` to test Google Analytics calls

## Unit Testing

Recipe | Description
--- | ---
[Application Code](./examples/unit-testing__application-code) | Import and test your own application code
[React](./examples/unit-testing__react) | Test your React components in isolation
[File Upload in React](./examples/file-upload-react) | Test file upload in React app

## Server Communication

Recipe | Description
--- | ---
[Bootstrapping your App](./examples/server-communication__bootstrapping-your-app) | Seed your application with test data
[Seeding your Database in Node](./examples/server-communication__seeding-database-in-node) | Seed your database with test data

## Community Recipes

Recipe | Description
--- | ---
[Visual Regression Testing](https://github.com/mjhea0/cypress-visual-regression) | Adding visual regression testing to Cypress
[Code coverage](https://github.com/paulfalgout/cypress-coverage-example) | Cypress with Coverage reports
[Cucumber](https://github.com/TheBrainFamily/cypress-cucumber-example) | Example usage of Cypress with Cucumber
[Jest](https://github.com/TheBrainFamily/jest-runner-cypress-example) | Example for the jest-runner-cypress

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

## Development

See [Development.md](Development.md)

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
