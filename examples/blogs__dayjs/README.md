# example: dayjs
> Using the [day.js](https://day.js.org/en/) instead of the deprecated Cypress.moment

You can install `day.js` as a regular NPM dependency and require or import it in your spec file. See [spec.js](cypress/integration/spec.js) for example:

```js
const dayjs = require('dayjs')

// in the test
const todaysDate = dayjs().format('MMM DD, YYYY')
cy.contains('span', `Order shipped on: ${todaysDate}`)
```
