# Offline network test

NOTE: This test has known issues related to bug in Chrome where "Offline Mode" does not impact websockets.
This execution is not recommended and will be refactored to use cy.intercept() at a later date. 

- [offline-spec.cy.js](cypress/e2e/offline-spec.cy.js) emulates offline network connection using Chrome Debugger Protocol and tests how the application handles it

![Network status test](images/offline.gif)
