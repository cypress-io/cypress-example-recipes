// In this recipe we have a <nav> with a couple of links
// that we want to test.
//
// One of the links has a target="_blank" attribute that
// would otherwise open in a new tab.
//
// Another link is pointed to an external domain that
// doesn't match our domain under test - https://www.google.com

describe('Tab Handling Anchor Links', function(){
  beforeEach(function(){
    cy
      .viewport(500, 300) // a small viewport is all we need for this recipe
      .visit("http://localhost:8080/examples/tab_handling_anchor_links/index.html")
  })

  context("testing the target='_blank' link", function(){
    // Tthe problem with this link is that by default when you click
    // on it, the browser will attempt to open the content in another
    // tab. You can open up your browser to the URL we visited above
    // and test this out. Notice a new tab will open.
    //
    // Cypress does not and may never have multi-tab support for various
    // reasons. Multiple tabs work against the way Cypress automates your
    // application and they are inherently flaky and inconsistent -
    // even if we did find a way to support them.
    //
    // Luckily there are lots of easy and safe workarounds which still give
    // you 100% confidence and enable you to test the behavior of your
    // application without any sacrifices.
    //
    // Remember the key to Cypress is thinking differently and not necessarily
    // doing things exactly like a real user. Robots aren't real users.

    it("solution #1: verify the href, dont click through", function(){
      // The first question we should ask ourselves is... why do we want
      // to even click this link?
      //
      // Can we simply verify the correctedness of our application without
      // performing any costly or additional actions such as clicking on the
      // <a> and loading a new page?
      //
      // If the answer is yes, then this is a super simple test.
      //
      // We simply verify that this <a> has the right href and that's it!
      cy.get("#users").should(function($a){
        // the href 'attribute' will only ever be what the
        // literal value is on the element itself and will
        // match what was served by the <html> payload
        expect($a).to.have.attr("href", "users.html")

        // an <a> also has an 'href' property which always resolves
        // to the fully qualified URL. by asserting on this property
        // we are testing this element more thoroughly
        expect($a).to.have.prop("href", "http://localhost:8080/examples/tab_handling_anchor_links/users.html")
      })
    })

    it("solution #2: click through to the new page", function(){
      // Okay so let's assume solution #1 isn't comprehensive enough for you.
      //
      // Perhaps you have some event handling on the click event and testing
      // the <a> href is just not good enough.
      //
      // Here's another simple way we can test the <a> behavior without opening
      // a new tab.
      cy
        // Because we have total and unrestricted access to everything in Cypress
        // we can simply modify 'the state of the world' to best suit our testing
        // needs.
        //
        // We can simply remove the offending attribute - target="_blank" which
        // would normally open content in a new tab.
        .get("#users").invoke("removeAttr", "target").click()

        // after clicking the <a> we are now navigated to the
        // new page and we can assert that the url is correct
        .url().should("include", "users.html")
    })

    it("solution #3: visit without modifying the <a>", function(){
      // Still not happy? Perhaps you don't like the idea of modifying your
      // application's HTML. I'm not sure why, but let's assume you want
      // some more ideas here without modifying the state of the world.
      //
      // We can still test this by simply visiting the href property that
      // would normally cause our browser to be navigated to.
      //
      cy.get("#users").then(function($a){
        // extract the fully qualified href property
        const href = $a.prop("href")

        // and now simply visit this directly
        cy
          .visit(href)
          .url().should("include", "users.html")
      })
    })

    it("solution #4: request without visiting", function(){
      // One thing you should always challenge yourself with is
      // trying to always reduce the time it takes for a test to
      // run.
      //
      // Our previous example is find technically, but remember that
      // when you cy.visit(...) a page, the whole application has to
      // load before that command resolves. That means all external
      // resources such as CSS, Javascript, and images must 'complete'
      // their loading phase before you can move on.
      //
      // In our simple example, this won't make a difference but in most
      // applications we're talking about 100's of milliseconds all the
      // way up to several seconds.
      //
      // We can avoid all of this extra nonsense work - especially if
      // other tests of ours cover those pages anyway!
      //
      // The solution is to use cy.request AS MUCH AS POSSIBLE. Under
      // the hood cy.request automatically gets and sets cookies which
      // makes it an immensely powerful tool for you to basically
      // 'act like the browser' but avoid all of the side effects
      // when it comes to loading resources you don't care about.
      //
      cy.get("#users").then(function($a){
        // extract the fully qualified href propert
        const href = $a.prop("href")

        cy
          // make an http request for this resource
          // outside of the browser
          .request(href)

          // drill into the response body
          .its("body")

          // and now assert about its contents
          // which is a string of the <html> response
          .should("include", "<title>")
          .and("include", "users.html")
          .and("include", "</html>")
      })
    })
  })

  context("testing the external domain link", function(){
    // The new problem we are facing has to do with an inherent restriction in
    // Cypress.
    //
    // We have a new <a> link that has an href that points to an external domain
    // which does not match the current domain under test.
    //
    // In Cypress, you are bound to a single superdomain PER TEST, although you
    // can test different domains in other tests.
    //
    // You can also test different subdomains in the same test, just not different
    // superdomains.
    //
    // We have this documented in detail here:
    // - https://on.cypress.io/guides/web-security
    // - https://on.cypress.io/cross-origin-violation
    //
    // Regardless of this restriction you have many options to overcome this
    // and still test your application with 100% confidence.

    it("solution #1: verify the href property only", function(){
      // Just like in our solution #1 above, the simpliest way to approach
      // testing an external link is simply not click through it.
      //
      // After all, let's think about this. Why would we want to click through
      // and test https://www.google.com?
      //
      // We're not in control of this site. In fact it may be down, or it may have
      // been updated and our assertions would fail through no fault of our own.
      // We may not even have internet access when we're running our tests!
      //
      // If that's the case, then this test is identical to solution #1 above!
      //
      cy.get("#google").should("have.prop", "href", "https://www.google.com/")
    })

    it("solution #2: request its contents", function(){
      // Okay but what if you REALLY REALLY want to see 'whats on the other side?'
      //
      // Let's assume that somehow this other completely different domain has or
      // was affected by something you did in YOUR application.
      //
      // Luckily we still have cy.request to our rescue, AND we avoid actually
      // loading that application. Normally Cypress catches event the slightest JS
      // errors which causes the current test to fail. Since that remote page
      // isn't under your control, it's way better not to actually cy.visit(...) it!
      //
      cy.get("#google").then(function($a){
        const href = $a.prop("href")

        cy
          // request the contents of https://www.google.com/
          .request(href)

          // drill into the response body
          .its("body")

          // Because we don't control this site - in fact google updates its home
          // page all the time, we don't feel comfortable making any kind of assertions
          // on the response body other than google having a closing <html> tag.
          // There are zero guarantees that other contents will stay the same, which is
          // why trying to test sites not under your control is a huge anti-pattern.
          // Don't do it.
          //
          // You will notice that this test even goes much slower than the others and
          // it requires internet access.
          .should("include", "</html>")
      })
    })

    it("solution #3: click through to the external domain", function(){
      // Wait what? I thought you said this wasn't just a bad idea, you said its not
      // even possible to do with Cypress!
      //
      // Okay it is a TERRIBLE idea to do this, but it is actually possible to do with
      // Cypress. There are downsides though, for instance this will NEVER be cross browser
      // compatible. To make this work we tap into Chrome's proprietary flags which expose
      // the ability to turn off its web security model. This enables us to test any and all
      // superdomains in a single test.
      //
      // You can read more about this here: https://on.cypress.io/guides/web-security
      //
      // This test will not work until you add {chromeWebSecurity: false} in your
      // cypress.json which is why the test is actually commented out.
      //
      // cy
      //   .get("#google").click()
      //   .url().should("include", "google.com")
    })
  })

})
