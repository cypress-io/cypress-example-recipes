/// <reference types="cypress" />

describe('Responsive image', () => {
  it('loads the mobile image', { viewportWidth: 400 }, () => {
    cy.intercept('elva-480w-close-portrait.jpg').as('mobileImage')
    cy.visit('responsive-images/picture.html')

    // the mobile image was loaded
    cy.wait('@mobileImage')
    // check the native resolution of the loaded image
    cy.get('img').should('have.prop', 'naturalWidth', 480)
  })

  it('loads the desktop image', { viewportWidth: 1000 }, () => {
    cy.intercept('elva-800w.jpg').as('desktopImage')
    cy.visit('responsive-images/picture.html')
    // the desktop image was loaded
    cy.wait('@desktopImage')
    // check the native resolution of the loaded image
    cy.get('img').should('have.prop', 'naturalWidth', 800)
  })

  it('asks for mobile image on resize', { viewportWidth: 1000 }, () => {
    cy.intercept('elva-480w-close-portrait.jpg').as('mobileImage')
    cy.intercept('elva-800w.jpg').as('desktopImage')

    cy.visit('responsive-images/picture.html')

    // the desktop image was loaded
    cy.wait('@desktopImage')
    .wait(1000) // just for demo purposes
    .log('resizing to mobile')

    cy.viewport('iphone-3')
    // the mobile image was loaded
    cy.wait('@mobileImage')
  })
})
