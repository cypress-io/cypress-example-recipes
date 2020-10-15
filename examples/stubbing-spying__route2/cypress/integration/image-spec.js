/// <reference types="Cypress" />

describe('route2', () => {
  it('spies on loading a static image', () => {
    cy.route2('/images').as('image')
    cy.visit('/pics.html')
    // how to check if the /image route was called once?
    // cy.wait('@image')
  })

  // https://github.com/cypress-io/cypress/issues/8623
  // NOTE: seems to cause an infinite loop
  it.skip('stubs a static image', () => {
    // 🐅 -> kenguru
    cy.route2('/images', {
      fixture: 'roo.jpg',
      headers: {
        'content-type': 'image/jpeg',
        'cache-control': 'public, max-age=0',
      },
    }).as('image')

    cy.visit('/pics.html')
  })

  // skipping because sometimes crashes
  // NOTE: https://github.com/cypress-io/cypress/issues/8858
  it.skip('redirects static image', () => {
    // instead of serving an image from a fixture
    // we can redirect the request for the image
    // to another route
    cy.route2({
      method: 'GET',
      url: '/images/tiger.jpg',
    }, (req) => {
      // /__root/* is a special URL that can serve a file from the
      // project's root. Normally this is used during bundling
      // but here we are using it to serve another image
      req.redirect('/__root/cypress/fixtures/roo.jpg')
    })

    cy.visit('/pics.html')
  })
})
