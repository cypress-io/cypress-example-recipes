/// <reference types="cypress" />
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

describe('Stub loading of resources', () => {
  it('requested image can be exchanged', () => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/apirequest',
      response: JSON.stringify({
        src: "https://cypress.io/cypress.png"
      })
    });

    cy.visit("index.html").then(() => {
      cy.get("#img-container").then($element => {
        var el = $element[0];
        observeDOM(el, mutations => {
          // red dot
          mutations[0].addedNodes[0].src = "data:image/png;base64," +
            "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGP" +
            "C/xhBQAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9YGARc5KB0XV+IA" +
            "AAAddEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIFRoZSBHSU1Q72QlbgAAAF1J" +
            "REFUGNO9zL0NglAAxPEfdLTs4BZM4DIO4C7OwQg2JoQ9LE1exdlYvBBeZ7jq" +
            "ch9//q1uH4TLzw4d6+ErXMMcXuHWxId3KOETnnXXV6MJpcq2MLaI97CER3N0" +
            "vr4MkhoXe0rZigAAAABJRU5ErkJggg=="
        })
      })
      cy.get("button").click()
      cy.get("#img-container > img").should($img => expect($img[0].naturalWidth).to.not.equal(0))
    })
  });
});

// helper function to observe DOM changes
var observeDOM = (obj, callback) => {
  if (!obj || !obj.nodeType === 1) {
    return;
  }

  if (MutationObserver) {
    var obs = new MutationObserver(mutations => {
      callback(mutations);
    })
    obs.observe(obj, { childList: true, subtree: true });
  } else if (window.addEventListener) {
    obj.addEventListener('DOMNodeInserted', callback, false);
    obj.addEventListener('DOMNodeRemoved', callback, false);
  }
}
