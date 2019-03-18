# Codepen.io Testing Demo

Demo of E2E testing HyperApp.js counter app running on Codepen.io.

## Blog Post

[Testing apps hosted on Codepen.io](https://www.cypress.io/blog/2017/12/05/testing-apps-hosted-on-codepen/)

![E2E tests against Codepen.io](img/all-tests.png)

Codepen [https://codepen.io/bahmutov/pen/ZaMxgz](https://codepen.io/bahmutov/pen/ZaMxgz)

**note:** before the better [lifecycle events land](https://github.com/cypress-io/cypress/issues/686) you need to wrap your application code on Codepen in IIFE

```js
(function() {
  const { h, app } = hyperapp;
  /** @jsx h */
  ...
}())
```
