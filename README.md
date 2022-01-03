# Recipes
[![CircleCI](https://circleci.com/gh/cypress-io/cypress-example-recipes/tree/master.svg?style=svg)](https://circleci.com/gh/cypress-io/cypress-example-recipes/tree/master) [![Build status](https://ci.appveyor.com/api/projects/status/7p4qkwavheciwbxc/branch/master?svg=true)](https://ci.appveyor.com/project/cypress-io/cypress-example-recipes/branch/master) [![renovate-app badge][renovate-badge]][renovate-app] [![Cypress Dashboard][dashboard badge]][dashboard url]

> This repo contains various recipes for testing common scenarios using Cypress: [Fundamentals](#fundamentals), [Testing the DOM](#testing-the-dom), [Logging in](#logging-in-recipes), [Preprocessors](#preprocessors), [Blogs](#blogs), [Stubbing and spying](#stubbing-and-spying), [Unit Testing](#unit-testing), [Server Communication](#server-communication), [Other Cypress Recipes](#other-cypress-recipes), [Community Recipes](#community-recipes)

## Fundamentals

Recipe | Description
--- | ---
[Node Modules](./examples/fundamentals__node-modules) | Import your own node modules
[Environment variables](./examples/server-communication__env-variables) | Passing environment variables to tests
[Handling errors](./examples/fundamentals__errors) | Handling thrown errors and unhandled promise rejections
[Dynamic tests](./examples/fundamentals__dynamic-tests) | Create tests dynamically from JSON data
[Dynamic tests from CSV](./examples/fundamentals__dynamic-tests-from-csv) | Create tests dynamically from CSV file
[Dynamic tests from API](./examples/fundamentals__dynamic-tests-from-api) | Create tests dynamically by calling an external API
[Fixtures](./examples/fundamentals__fixtures) | Loading single or multiple fixtures
[Adding Custom Commands](./examples/fundamentals__add-custom-command) | Write your own custom commands using JavaScript with correct types for IntelliSense to work
[Adding Custom Commands (TS)](./examples/fundamentals__add-custom-command-ts) | Write your own custom commands using TypeScript
[Adding Chai Assertions](./examples/extending-cypress__chai-assertions) | Add new or custom chai assertions with correct types
[Cypress module API](./examples/fundamentals__module-api) | Run Cypress via its module API
[Wrapping Cypress module API](./examples/fundamentals__module-api-wrap) | Writing a wrapper around "cypress run" command line parsing
[Custom browsers](./examples/fundamentals__custom-browsers) | Control which browsers the project can use, or even add a custom browser into the list
[Use Chrome Remote Interface](./examples/fundamentals__chrome-remote-debugging) | Use Chrome debugger protocol to trigger hover state and print media style
[Out-of-the-box TypeScript](./examples/fundamentals__typescript) | Write tests in TypeScript without setting up preprocessors
[Per-test timeout](./examples/fundamentals__timeout) | Fail a test if it runs longer than the specified time limit
[Cypress events](./examples/fundamentals__cy-events) | Using `Cypress.on` and `cy.on` to listen to [Cypress events](https://on.cypress.io/catalog-of-events) like `before:window:load`
[Video resolution](./examples/fundamentals__window-size) | Increase the browser window size to record high quality videos and capture detailed screenshots

## Testing the DOM

Recipe | Description
--- | ---
[Tab Handling and Links](./examples/testing-dom__tab-handling-links) | Links that open in a new tab
[Hover and Hidden Elements](./examples/testing-dom__hover-hidden-elements) | Test hidden elements requiring hover
[Form Interactions](./examples/testing-dom__form-interactions) | Test form elements like input type `range`
[Drag and Drop](./examples/testing-dom__drag-drop) | Use `.trigger()` to test drag and drop
[Shadow DOM](./examples/testing-dom__shadow-dom) | You need to use any of available custom commands
[Waiting for static resource](./examples/testing-dom__wait-for-resource) | Shows how to wait for CSS, image, or any other static resource to load
[CSV load and table test](./examples/testing-dom__csv-table) | Loads CSV file and quickly compares objects against cells in a table
[Evaluate performance metrics](./examples/testing-dom__performance-metrics) | Utilize Cypress to monitor a website
[Root style](./examples/testing-dom__root-style) | Trigger input color change that modifies CSS variable
[Select widgets](./examples/testing-dom__select2) | Working with `<select>` elements and [Select2](https://select2.org/) widgets
[Lit Elements](./examples/testing-dom__lit-element) | Testing Lit Elements with Shadow DOM
[File download](./examples/testing-dom__download) | Download and validate CSV, Excel, text, Zip, and image files
[Page reloads](./examples/testing-dom__page-reloads) | Avoiding `while` loop when dealing with randomness
[Pagination](./examples/testing-dom__pagination) | Clicking the "Next" link until we reach the last page
[Clipboard](./examples/testing-dom__clipboard) | Copy and paste text into the clipboard from the test
[Page source](./examples/testing-dom__page-source) | Get the source of the page under test
[Responsive image](./examples/testing-dom__responsive-image) | Uses `cy.intercept` to confirm the image loaded by the `<picture>` element

## Logging in recipes

Recipe | Description
--- | ---
[Basic Auth](./examples/logging-in__basic-auth) | Log in using Basic Authentication
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
[React DevTools](./examples/blogs__use-react-devtools) | Loads React DevTools Chrome extension automatically
[Expect N assertions](./examples/blogs__assertion-counting) | How to expect a certain number of assertions in a test
[Browser notifications](./examples/blogs__notification) | How to test application that uses [`Notification`](https://developer.mozilla.org/en-US/docs/Web/API/notification)
[Testing iframes](./examples/blogs__iframes) | Accessing elements in 3rd party iframe, spy and stub network calls from iframe
[Class decorators](./examples/blogs__class-decorator) | Using JavaScript class decorator to expose objects created by the application so they are reachable from tests
[Form Submit](./examples/blogs__form-submit) | Removing flake from the test where a page is reloaded after form submission
[Using Day.js instead of Moment.js](./examples/blogs__dayjs) | Using [day.js](https://day.js.org/) library instead of the deprecated `Cypress.moment`

## Network stubbing and spying

Recipe | Description
--- | ---
[Stubbing using `cy.intercept`](./examples/stubbing-spying__intercept) | Control network using `cy.intercept` API

## JS-level stubbing and spying

Recipe | Description
--- | ---
[Stubbing Functions](./examples/stubbing-spying__functions) | Use `cy.spy()` and `cy.stub()` to test function calls
[Stubbing `window.fetch`](./examples/stubbing-spying__window-fetch) | Work around the `window.fetch` limitation
[Stubbing `window.open` and `console.log`](./examples/stubbing-spying__window) | Use `cy.stub()` and `cy.spy()` to test application behavior
[Stubbing `window.print`](./examples/stubbing-spying__window-print) | Use `cy.stub()` to test `window.print` call made from the application
[Stubbing Google Analytics](./examples/stubbing-spying__google-analytics) | Use `cy.stub()` or `cy.intercept()` to test Google Analytics calls
[Spying and stubbing methods on `console` object](./examples/stubbing-spying__console) | Use `cy.spy()` and `cy.stub()` on `console.log`
[Stub resource loading](./examples/stubbing__resources) | Use `MutationObserver` to stub resource loading like `img` tags
[Stub `navigator.cookieEnabled` property](./examples/stubbing-spying__navigator) | Use `cy.stub()` to mock the `navigator.cookieEnabled` property

## Unit Testing

Recipe | Description
--- | ---
[Application Code](./examples/unit-testing__application-code) | Import and test your own application code

**Note:** looking for the React/Vue component testing recipes? Read the [Introducing the Cypress Component Test Runner– new in 7.0.0](https://www.cypress.io/blog/2021/04/06/introducing-the-cypress-component-test-runner/) blog post.

## Server Communication

Recipe | Description
--- | ---
[Bootstrapping your App](./examples/server-communication__bootstrapping-your-app) | Seed your application with test data
[Seeding your Database in Node](./examples/server-communication__seeding-database-in-node) | Seed your database with test data
[XHR assertions](./examples/server-communication__xhr-assertions) | Spy and assert on application's network calls
[Visiting 2nd domain](./examples/server-communication__visit-2nd-domain) | Visiting two different domains from two different tests and passing value from one test to another
[Pass value between specs](./examples/server-communication__pass-value-between-specs) | Pass a value from spec to spec via the plugin file using [cy.task](https://on.cypress.io/task)
[Stream test results](./examples/server-communication__stream-tests) | Streams each test result from the browser to the plugins to an external process via IPC
[Offline](./examples/server-communication__offline) | Test web application when the network is offline
[Server timing](./examples/server-communication__server-timing) | Report server timing results from Cypress test
[Wait for API](./examples/server-communication__wait-for-api) | Call the backend using `cy.request` until it responds
[Making HTTP requests](./examples/server-communication__request) | How to use `cy.request`, `window.fetch`, and `cy.task` commands to make HTTP requests to the server with and without cookies

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
[Triple Tested Static Site](https://glebbahmutov.com/blog/triple-tested/) | How to test static sites three times before and after deployment to GitHub pages

## Community Recipes

Recipe | Description
--- | ---
[Visual Regression Testing](https://github.com/mjhea0/cypress-visual-regression) | Adding visual regression testing to Cypress
[Code coverage](https://github.com/paulfalgout/cypress-coverage-example) | Cypress with Coverage reports
[Cucumber](https://github.com/TheBrainFamily/cypress-cucumber-example) | Example usage of Cypress with Cucumber
[Jest](https://github.com/TheBrainFamily/jest-runner-cypress-example) | Example for the jest-runner-cypress
[Mailosaur](https://github.com/muratkeremozcan/cypressExamples/tree/master/cypress-mailosaur) | Utilizes `cy.request()` or `cy.task()` with [`mailosaur`](https://www.npmjs.com/package/mailosaur) to test emails sent with [`sendmail`](https://www.npmjs.com/package/sendmail)
[Chat App](https://glebbahmutov.com/blog/test-socketio-chat-using-cypress/) | Test a Socket.io Chat App using Cypress
[Email Testing](https://www.cypress.io/blog/2021/05/24/full-testing-of-html-emails-using-ethereal-accounts/) | Full Testing of HTML Emails using SendGrid and Ethereal Accounts

## Overview

- This repo is structured similar to how other "Monorepos" work.
- Each [`example project`](./examples) has its own Cypress configuration, tests, backend and frontend assets.
- Each of these [`example projects`](./examples) share a single "root" Cypress that is installed in the root `node_modules` folder.
- This structure looks different from normal projects, but its the easiest way to manage multiple projects without installing Cypress independently for each one.

## Installation

```bash
## install all dependencies from the root directory
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

You can find the recording at the Cypress Dashboard linked below

[![Cypress Dashboard][dashboard badge]][dashboard url]

## Development

See [Development.md](Development.md)

[renovate-badge]: https://img.shields.io/badge/renovate-app-blue.svg
[renovate-app]: https://renovateapp.com/
[dashboard badge]: https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/simple/6p53jw/master&style=flat&logo=cypress
[dashboard url]: https://dashboard.cypress.io/projects/6p53jw/runs
