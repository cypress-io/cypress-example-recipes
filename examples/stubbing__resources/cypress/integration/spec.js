/// <reference types="cypress" />
/* global window */
const MutationObserver = window.MutationObserver || window.WebKitMutationObserver

// helper function to observe DOM changes
function observeDOM (obj, callback) {
  if (!obj || obj.nodeType !== window.Node.ELEMENT_NODE) {
    throw new Error('can not observe this element')
  }

  const obs = new MutationObserver(callback)

  obs.observe(obj, { childList: true, subtree: true })
}

describe('Stub loading of resources', () => {
  it('requested image can be exchanged', () => {
    cy.visit('index.html')

    let imgStr

    // load mock image data from the fixture file
    // and save in a local variable
    cy.fixture('picture.png', 'base64')
    .then((imgString) => {
      imgStr = imgString
    })

    // start watching the image container for new elements added
    cy.get('#img-container').then(($element) => {
      let el = $element[0]

      observeDOM(el, (mutations) => {
        // we could check the type of the added node
        // but for now we are assuming it is a new image node
        mutations[0].addedNodes[0].src = `data:image/png;base64,${imgStr}`
      })
    })

    cy.get('button').click()

    // image element will have "naturalWidth" set when it loads
    // the page tries to load "images/rose.png" with dimensions 70x46
    // but the test will substitute "cypress/fixtures/picture.png" that is 100x100
    cy.get('#img-container > img').should(($img) => expect($img[0].naturalWidth).to.equal(100))
  })
})
