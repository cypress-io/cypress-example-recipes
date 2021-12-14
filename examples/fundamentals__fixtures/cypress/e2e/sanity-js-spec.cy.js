/// <reference types="cypress" />

// bundled "os" module does not have the right EOL
// thus we need to set it based on the platform ourself
const EOL = Cypress.platform === 'win32' ? '\\' : '/'

/**
 * Joins parts of the file path using the EOL
 * @example
 *  join('cypress', 'e2e')
 *    "cypress/e2e" on non-Windows
 *    "cypress\e2e" on Windows
*/
const join = (...paths) => paths.join(EOL)

describe('sanity JavaScript tests', () => {
  // confirm that the spec information is present

  it('has __dirname', () => {
    expect(__dirname).to.be.a('string')
    // on Windows OS the directory is "cypress\e2e"
    // on other operating systems it is "cypress/e2e"
    expect(__dirname).to.equal(join('cypress', 'e2e'))
  })

  it('has __filename', () => {
    expect(__filename).to.be.a('string')
    expect(__filename).to.equal(
      join('cypress', 'e2e', 'sanity-js-spec.cy.js')
    )
  })
})
