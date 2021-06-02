/// <reference types="cypress" />

// bundled "os" module does not have the right EOL
// thus we need to set it based on the platform ourself
const EOL = Cypress.platform === 'win32' ? '\\' : '/'

/**
 * Joins parts of the file path using the EOL
 * @example
 *  join('cypress', 'integration')
 *    // "cypress/integration" on non-Windows
 *    // "cypress\integration" on Windows
*/
const join = (...paths) => paths.join(EOL)

describe('sanity JavaScript tests', () => {
  // confirm that the spec information is present

  it('has __dirname', () => {
    expect(__dirname).to.be.a('string')
    // on Windows OS the directory is "cypress\integration"
    // on other operating systems it is "cypress/integration"
    expect(__dirname).to.equal(join('cypress', 'integration'))
  })

  it('has __filename', () => {
    expect(__filename).to.be.a('string')
    expect(__filename).to.equal(
      join('cypress', 'integration', 'sanity-js-spec.js')
    )
  })
})
