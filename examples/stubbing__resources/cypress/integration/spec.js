/// <reference types="cypress" />
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

describe('Stub loading of resources', () => {
  it('requested image can be exchanged', () => {
    cy.visit("index.html").then(() => {
      let imgStr;

      cy.fixture("picture.png", "base64").then(imgString => {
        imgStr = imgString;
      }).get("#img-container").then($element => {
        var el = $element[0];
        observeDOM(el, mutations => {
          mutations[0].addedNodes[0].src = "data:image/png;base64," + imgStr;
        })
      })
      cy.get("button").click()
      cy.get("#img-container > img").should($img => expect($img[0].naturalWidth).to.not.equal(0))
    })
  });
});

// helper function to observe DOM changes
function observeDOM(obj, callback) {
  if (!obj || obj.nodeType !== Node.ELEMENT_NODE) {
    throw new Error("can not observe this element");
  }

  var obs = new MutationObserver(mutations => {
    callback(mutations);
  });
  obs.observe(obj, { childList: true, subtree: true });
}