// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="Cypress" />

/**
 * Adds command "cy.waitForResource(name)" that checks performance entries
 * for resource that ends with the given name.
 * This command only applies to the tests in this spec file
 *
 * @see https://developers.google.com/web/tools/chrome-devtools/network/understanding-resource-timing
 */
Cypress.Commands.add('waitForResource', (name, options = {}) => {
  cy.log(`Waiting for resource ${name}`)

  const log = false // let's not log inner commands
  const timeout = options.timeout || Cypress.config('defaultCommandTimeout')

  cy.window({ log }).then(
    // note that ".then" method has options first, callback second
    // https://on.cypress.io/then
    { log, timeout },
    (win) => {
      return new Cypress.Promise((resolve, reject) => {
        let foundResource

        // control how long we should try finding the resource
        // and if it is still not found. An explicit "reject"
        // allows us to show nice informative message
        setTimeout(() => {
          if (foundResource) {
            // nothing needs to be done, successfully found the resource
            return
          }

          clearInterval(interval)
          reject(new Error(`Timed out waiting for resource ${name}`))
        }, timeout)

        const interval = setInterval(() => {
          foundResource = win.performance
          .getEntriesByType('resource')
          .find((item) => item.name.endsWith(name))

          if (!foundResource) {
            // resource not found, will try again
            return
          }

          clearInterval(interval)
          // because cy.log changes the subject, let's resolve the returned promise
          // with log + returned actual result
          resolve(
            cy.log('✅ success').then(() => {
              // let's resolve with the found performance object
              // to allow tests to inspect it
              return foundResource
            })
          )
        }, 100)
      })
    }
  )
})

// we allow these tests to fail and retry them because timing
// thresholds require leeway. Setting them too high makes the
// tests imprecise. Setting them to more likely values makes the tests flakey.
// @see https://www.cypress.io/blog/2020/12/03/retry-rerun-repeat/
describe('loading style', { retries: 2 }, () => {
  it('applies app.css styles', () => {
    cy.visit('/')
    cy.waitForResource('base.css')
    cy.waitForResource('app.css')
    // red color means the style from "app.css" has been loaded and applied
    cy.get('h1', { timeout: 250 }).should('have.css', 'color', 'rgb(255, 0, 0)')
  })

  it('app.css is a tiny resource', () => {
    cy.visit('/')
    cy.waitForResource('app.css').then((resourceTiming) => {
      expect(resourceTiming, 'got resource timing').to.not.be.null

      // there are lots of timing properties in this object
      expect(resourceTiming)
      .property('entryType')
      .to.equal('resource')

      expect(resourceTiming, 'the CSS file is very small (in bytes)')
      .property('transferSize')
      .to.be.lt(300)

      expect(resourceTiming, 'loads in less than 150ms')
      .property('duration')
      .to.be.lt(150)
    })
  })

  it('waits for multiple resources', () => {
    cy.visit('/')
    // the "cy.waitForResources" command was written in cypress/support/index.js file
    cy.waitForResources('base.css', 'app.css')
    // red color means the style from "app.css" has been loaded and applied
    cy.get('h1', { timeout: 250 }).should('have.css', 'color', 'rgb(255, 0, 0)')
  })

  it('waits on resource using wait-until 3rd party plugin', () => {
    cy.visit('/')

    // 3rd party module "cypress-wait-until" is really useful
    // for simple conditions like waiting for an item
    // @see https://github.com/NoriSte/cypress-wait-until
    cy.waitUntil(() => {
      return cy.window().then((win) => {
        return win.performance
        .getEntriesByType('resource')
        // note: ".some(...)" method returns boolean value
        // which cypress-wait-until expects
        .some((item) => item.name.endsWith('app.css'))
      })
    })

    // red color means the style from "app.css" has been loaded and applied
    cy.get('h1', { timeout: 250 }).should('have.css', 'color', 'rgb(255, 0, 0)')
  })
})

describe('loading images', () => {
  it('waits for the image to load', () => {
    cy.visit('/')

    // we can wait for the <img> element to appear
    // but the image has not been loaded yet.
    cy.get('[alt="delayed image"]').should('be.visible')

    // Let's wait for the actual image to load
    cy.waitForResource('cypress-logo.png')
  })

  it('waits for the image to have actual dimensions', () => {
    cy.visit('/')

    // we can wait for the <img> element to appear
    // but the image has not been loaded yet.
    cy.get('[alt="delayed image"]')
    .should('be.visible')
    .and(($img) => {
      // "naturalWidth" and "naturalHeight" are set when the image loads
      expect(
        $img[0].naturalWidth,
        'image has natural width'
      ).to.be.greaterThan(0)
    })
  })
})

describe('loading script', () => {
  it('waits for the script to load', () => {
    cy.visit('/')
    cy.window().its('console').then((console) => cy.spy(console, 'log').as('console'))
    cy.waitForResource('a-script.js')
    // once the resource is loaded, it might take a turn to compile and run
    // thus we need to give the script time to call the console by retrying
    cy.get('@console').should('have.been.calledOnce')
  })
})
