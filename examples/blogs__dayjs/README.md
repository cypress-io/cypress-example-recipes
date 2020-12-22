# example: dayjs
> Using the [day.js](https://day.js.org/en/) instead of the deprecated Cypress.moment

You can install `day.js` as a regular NPM dependency and require or import it in your spec file. See [spec.js](cypress/integration/spec.js) for example:

```js
const dayjs = require('dayjs')

// in the test
const todaysDate = dayjs().format('MMM DD, YYYY')
cy.contains('span', `Order shipped on: ${todaysDate}`)
```

Alternatively, if many specs need the dayjs library, you can load it from the [support file](cypress/support/index.js) and set the reference as `Cypress.dayjs` to make the library available in every spec.

```js
// support file
const dayjs = require('dayjs')

Cypress.dayjs = dayjs
```

## Plugins

The dayjs library splits major features into plugins. The plugins are included with the NPM module, but they need to be loaded and registered separately. For example, if you want to parse UTC dates and custom string formats, you would need to:

```js
const dayjs = require('dayjs')
// https://day.js.org/docs/en/plugin/utc
const utc = require('dayjs/plugin/utc')
// https://day.js.org/docs/en/plugin/custom-parse-format
const customParseFormat = require('dayjs/plugin/customParseFormat')

dayjs.extend(utc)
dayjs.extend(customParseFormat)
```
