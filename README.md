# Recipes [![CircleCI](https://circleci.com/gh/cypress-io/cypress-example-recipes/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-example-recipes/tree/master) [![Build status](https://ci.appveyor.com/api/projects/status/7p4qkwavheciwbxc/branch/master?svg=true)](https://ci.appveyor.com/project/cypress-io/cypress-example-recipes/branch/master) [![renovate-app badge][renovate-badge]][renovate-app]

> This repo contains various recipes for testing common scenarios using Cypress: [Fundamentals](#fundamentals), [Testing the DOM](#testing-the-dom), [Logging in](#logging-in-recipes), [Preprocessors](#preprocessors), [Blogs](#blogs), [Stubbing and spying](#stubbing-and-spying), [Unit Testing](#unit-testing), [Server Communication](#server-communication), [Other Cypress Recipes](#other-cypress-recipes), [Community Recipes](#community-recipes)

## Fundamentals

Recipe | Description
--- | ---
[Node Modules](./examples/fundamentals__node-modules) | Import your own node modules
[Environment variables](./examples/server-communication__env-variables) | Passing environment variables to tests
[Dynamic tests](./examples/fundamentals__dynamic-tests) | Create tests dynamically from data
[Fixtures](./examples/fundamentals__fixtures) | Loading single or multiple fixtures
[Adding Custom Commands](./examples/fundamentals__add-custom-command) | Write your own custom commands with correct types
[Adding Chai Assertions](./examples/extending-cypress__chai-assertions) | Add new or custom chai assertions with correct types
[Cypress module API](./examples/fundamentals__module-api) | Run Cypress via its module API
[Custom browsers](./examples/fundamentals_custom-browsers) | Control which browsers the project can use, or even add a custom browser into the list

## Testing the DOM

Recipe | Description
--- | ---
[Tab Handling and Links](./examples/testing-dom__tab-handling-links) | Links that open in a new tab
[Hover and Hidden Elements](./examples/testing-dom__hover-hidden-elements) | Test hidden elements requiring hover
[Form Interactions](./examples/testing-dom__form-interactions) | Test form elements like input type `range`
[Drag and Drop](./examples/testing-dom__drag-drop) | Use `.trigger()` to test drag and drop
[Shadow DOM](./examples/testing-dom__shadow-dom) | You need to use any of available custom commands
[Waiting for static resource](./examples/testing-dom__wait-for-resource) | Shows how to wait for CSS, image, or any other static resource to load
[CSV load and table test](./examples/testing-dom__csv-table) | Loads CSV file and compares objects against cells in a table
[Evaluate performance metrics](./examples/testing-dom__performance-metrics) | Utilize Cypress to monitor a website

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
[Flow with Browserify](./examples/preprocessors__flow-browserify) | Add flow support with browserify

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
[A11y Testing](./examples/blogs__a11y) | Accessibility testing with [cypress-axe](https://github.com/avanslaars/cypress-axe#readme)
[Automate Angular Testing](https://www.cypress.io/blog/2019/08/02/guest-post-angular-adding-cypress-ui-tests-to-your-devops-pipeline/) | Run Angular tests in a build environment

## Stubbing and spying

Recipe | Description
--- | ---
[Stubbing Functions](./examples/stubbing-spying__functions) | Use `cy.spy()` and `cy.stub()` to test function calls
[Stubbing `window.fetch`](./examples/stubbing-spying__window-fetch) | Use `cy.stub()` to control fetch requests
[Stubbing `window.open` and `console.log`](./examples/stubbing-spying__window) | Use `cy.stub()` and `cy.spy()` to test application behavior
[Stubbing Google Analytics](./examples/stubbing-spying__google-analytics) | Use `cy.stub()` to test Google Analytics calls
[Spying and stubbing methods on `console` object](./examples/stubbing-spying__console) | Use `cy.spy()` and `cy.stub()` on `console.log`
[Stub resource loading](./examples/stubbing__resources) | Use `MutationObserver` to stub resource loading like `img` tags

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
[XHR assertions](./examples/server-communication__xhr-assertions) | Spy and assert on application's network calls

## Other Cypress Recipes

Recipe | Description
--- | ---
[Visual Testing](https://on.cypress.io/visual-testing) | Official Cypress guide to visual testing
[Code Coverage](https://on.cypress.io/code-coverage) | Official Cypress guide to code coverage
[detect-page-reload](https://glebbahmutov.com/blog/detect-page-reload/) | How to detect from Cypress test when a page reloads using object property assertions
[run in Docker](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/) | Run Cypress with a single Docker command
[SSR E2E](https://glebbahmutov.com/blog/ssr-e2e/) | End-to-end Testing for Server-Side Rendered Pages
[Using TS aliases](https://glebbahmutov.com/blog/using-ts-aliases-in-cypress-tests/) | Using TypeScript aliases in Cypress tests
[stub-navigator-api](https://glebbahmutov.com/blog/stub-navigator-api/) | Stub navigator API in end-to-end tests
[Readable Cypress.io tests](https://glebbahmutov.com/blog/readable-tests/) | How to write readable tests using custom commands and custom Chai assertions
[Parallel or not](https://glebbahmutov.com/blog/parallel-or-not/) | Run Cypress in parallel mode on CircleCI depending on environment variables
[Use TypeScript With Cypress](https://glebbahmutov.com/blog/use-typescript-with-cypress/) | Step by step tutorial on how to set up TypeScript support in Cypress using WebPack bundler
[Cypress should callback](https://glebbahmutov.com/blog/cypress-should-callback/) | Examples of `.should(cb)` assertions
[Cypress jump](https://glebbahmutov.com/blog/cypress-jump/) | Create a React component using JSX and inject it into live application from a Cypress test
[Unit testing Vuex data store using Cypress.io Test Runner](https://dev.to/bahmutov/unit-testing-vuex-data-store-using-cypress-io-test-runner-3g4n) | Complete walkthrough for anyone trying to unit test a data store

## Community Recipes

Recipe | Description
--- | ---
[Visual Regression Testing](https://github.com/mjhea0/cypress-visual-regression) | Adding visual regression testing to Cypress
[Code coverage](https://github.com/paulfalgout/cypress-coverage-example) | Cypress with Coverage reports
[Cucumber](https://github.com/TheBrainFamily/cypress-cucumber-example) | Example usage of Cypress with Cucumber
[Jest](https://github.com/TheBrainFamily/jest-runner-cypress-example) | Example for the jest-runner-cypress

## Overview

- This repo is structured similar to how other "Monorepos" work.
- Each [`example project`](./examples) has its own Cypress configuration, tests, backend and frontend assets.
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
