/// <reference types="Cypress" />

describe('intercept', () => {
  it('spies on loading a static image', () => {
    cy.intercept('/images').as('image')
    cy.visit('/pics.html')
    cy.wait('@image')

    // reload the page, it should send another request
    cy.reload()
    cy.wait('@image')
  })

  it('spies on loading a static image (2nd test)', () => {
    cy.intercept('/images').as('image')
    cy.visit('/pics.html')
    cy.wait('@image')
  })

  it('stubs a static image', () => {
    // 🐅 -> 🦘
    cy.intercept('/images', {
      fixture: 'roo.jpg',
      headers: {
        'content-type': 'image/jpeg',
        'cache-control': 'public, max-age=0',
      },
    }).as('image')

    cy.visit('/pics.html')
    // we DO see the roo image, but again, just like the test above
    // cannot wait for it using cy.wait
  })

  it('stubs a static image using fixture', () => {
    // 🐅 -> 🦘
    cy.intercept('/images', { fixture: 'roo.jpg' })
    cy.visit('/pics.html')
    // we DO see the roo image, but again, just like the test above
    // cannot wait for it using cy.wait

    // confirm the fixture has loaded by looking at its dimensions
    // use "closeTo" assertion because sometimes browsers renders
    // images with subpixel accuracy
    cy.get('img').invoke('width').should('closeTo', 300, 1)
    cy.get('img').invoke('height').should('closeTo', 450, 1)
  })

  it('redirects static image', () => {
    // instead of serving an image from a fixture
    // we can redirect the request for the image
    // to another route
    cy.intercept({
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
