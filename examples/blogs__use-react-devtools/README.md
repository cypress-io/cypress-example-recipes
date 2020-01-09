# use React DevTools Chrome extension

Read blog post [How to load the React DevTools extension in Cypress](https://www.cypress.io/blog/2020/01/07/how-to-load-the-react-devtools-extension-in-cypress/)

TicTacToe app from https://github.com/itsrave/tictactoe-react

React DevTools extension copied from installed extension in Chrome by finding its profile data folder (shown when you go to `chrome://version/` url) and copying by extension id into [4.2.1_0](4.2.1_0) folder. When Cypress launches the browser it loads this extension using path, see [cypress/plugins/index.js](cypress/plugins/index.js)

## Known problems

1. React Components shows both Cypress UI and the application under test.
2. Running multiple tests or rerunning the test keeps adding new components, without removing the existing ones
3. The components are not mapped correctly to the scaled iframe position
