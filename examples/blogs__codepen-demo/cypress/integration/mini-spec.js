/// <reference types="cypress" />
/* eslint-env mocha */
/* global cy */
beforeEach(function loadAppIFrameAndSetAsOurTestDocument () {
  const doc = cy.state('document')
  cy.log('Writing HTML into test document')
  const html = /* html */ `
    <script>
      const foo = 42
    </script>
  `
  Array.from(doc.body.children).forEach((child) => doc.body.removeChild(child))
  doc.write(html)
  doc.close()
})

it('works 1', () => {})

it('works 2', () => {})
