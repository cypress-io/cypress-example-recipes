// In this recipe we have a <nav> with some links we want
// to test in /examples/tab_handling_anchor_links/index.html
//
// One of the links has a target='_blank' attribute that
// should open in a new tab.
//
// Another link is pointed to an external domain that
// doesn't match our domain under test - https://www.google.com

describe('Tab Handling Anchor Links', function () {
  beforeEach(function () {
    cy.visit('/index.html')
  })

  context('testing the target="_blank" link', function () {
    // The problem with the 'users' link is that by default when you click
    // on it, the browser will attempt to open the content in another
    // tab. You can open up your browser to the URL we visited above
    // and test this out. Notice a new tab will open.
    //
    // Cypress does not and may never have multi-tab support for various
    // reasons. Multiple tabs work against the way Cypress automates your
    // application and they are inherently flaky and inconsistent -
    // even if we did find a way to support them.
    //
    // Luckily there are lots of easy and safe workarounds that
    // enable you to test the behavior of your application

    it('solution #1: verify the href, dont click through', function () {
      // The first question we should ask ourselves is... why do we want
      // to even click this link?
      //
      // Can we verify the correctedness of our application without
      // performing any costly or additional actions such as clicking
      // on the <a> and loading a new page?
      //
      // If the answer is yes, then this is a super simple test.
      //
      // We verify that the <a> has the right href and that's it!
      cy.get('#users')
      // the href 'attribute' will only ever be what the
      // literal value is on the element itself and will
      // match what was served by the <html> payload
      .should('have.attr', 'href')
      .and('include', 'users.html')

      cy.get('#users')
      // an <a> also has an 'href' property which always resolves
      // to the fully qualified URL. by asserting on this property
      // we are testing this element more thoroughly
      .should('have.prop', 'href')
      .and('equal', 'http://localhost:7078/users.html')
    })

    it('solution #2: click through to the new page', function () {
      // Okay so let's assume solution #1 isn't comprehensive enough
      //
      // Perhaps you have some event handling on the click event
      // and testing the <a> href is just not good enough.
      //
      // Here's another simple way we can test the <a> behavior
      // without opening a new tab.

      // Because we have total and unrestricted access
      // to everything in Cypress we can simply modify
      // 'the state of the world' to best suit our testing needs.
      //
      // We can remove the offending attribute - target='_blank'
      // that would normally open content in a new tab.
      cy.get('#users').invoke('removeAttr', 'target').click()

      // after clicking the <a> we are now navigated to the
      // new page and we can assert that the url is correct
      cy.url().should('include', 'users.html')
    })

    it('solution #3: visit without modifying the <a>', function () {
      // Still not happy? Perhaps you don't like the idea of modifying your
      // application's HTML.
      //
      // We can still test this by visiting the href property that
      // would normally cause our browser to be navigated.

      cy.get('#users').then(function ($a) {
        // extract the fully qualified href property
        const href = $a.prop('href')

        // and now visit the href directly
        cy.visit(href)
        cy.url().should('include', 'users.html')
      })
    })

    it('solution #4: request without visiting', function () {
      // One thing you should always challenge yourself with is
      // trying to always reduce the time it takes to run a test
      //
      // Our previous example is fine technically, but when you
      // cy.visit(...) a page, the whole application has to
      // load before the command resolves. That means all external
      // resources such as CSS, JavaScript, and images must
      // 'complete' their loading phase before you can move on.
      //
      // In some applications loading a page can take
      // 100's of milliseconds to several seconds.
      //
      // We can avoid all of this extra loading time - especially if
      // our other tests cover those pages!
      //
      // The solution is to use cy.request. cy.request
      // automatically gets and sets cookies. This makes it so
      // your tests can 'act like the browser' and avoid all
      // of the side effects of loading resources.

      cy.get('#users').then(function ($a) {
        // extract the fully qualified href property
        const href = $a.prop('href')

        // make an http request for this resource
        // outside of the browser
        cy.request(href)
        // drill into the response body
        .its('body')

        // and assert that its contents have the <html> response
        .should('include', '<title>')
        .and('include', '<h1>Users</h1')
        .and('include', '</html>')
      })
    })
  })

  context('testing the external domain link', function () {
    // We have another <a> link that has an href that points to an
    // external domain that doesn't match our current domain under test.
    //
    // In Cypress, you are bound to a single superdomain per test,
    // although you can test different domains in different tests.
    //
    // You can also test different subdomains in the same test,
    // just not different superdomains.
    //
    // We have this documented in detail here:
    // - https://on.cypress.io/web-security
    // - https://on.cypress.io/cross-origin-violation
    //
    // Regardless, there are still many ways to test this behavior.

    it('solution #1: verify the href property only', function () {
      // The simpliest way to test an external link
      // involves not clicking on it.

      // Instead, we verify that the <a> has the right href.

      cy.get('#google').should('have.prop', 'href', 'https://www.google.com/')
    })

    it('solution #2: request its contents', function () {
      // Okay but what if you need to see the content of the external
      // page being clicked on?
      //
      // We still have cy.request to our rescue.

      cy.get('#google').then(function ($a) {
        const href = $a.prop('href')

        // request the contents of https://www.google.com/
        cy.request(href)

        // drill into the response body
        .its('body')

        // Because we don't control this site - we don't feel
        // comfortable making any kind of assertions
        // on the response body other than google having a closing <html> tag.
        //
        // You will notice that this test still goes much
        // slower than the others and it requires internet access.
        .should('include', '</html>')
      })
    })

    it('solution #3: click through to the external domain', function () {
      // It is not preferred to do this, but it is actually possible
      // to click through the external domain with Cypress. There are
      // downsides though, for instance this is not cross browser
      // compatible. To make this work we use Chrome's proprietary flags
      // that expose the ability to turn off its web security model.
      // This enables us to test any and all superdomains in a single test.
      //
      // You can read more about this here:
      // https://on.cypress.io/web-security
      //
      // This test will not work until you add {chromeWebSecurity: false} in your
      // cypress.json which is why the test below is commented out.
      //
      // cy.get('#google').click()
      // cy.url().should('include', 'google.com')
    })
  })
})
