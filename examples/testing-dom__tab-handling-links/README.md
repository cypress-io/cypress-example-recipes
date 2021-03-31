# tab-handling-anchor-links
> How to get around lack of multiple tabs in Cypress

Read [Trade-offs - Multiple tabs](http://on.cypress.io/trade-offs#Multiple-tabs), and see [cypress/integration/tab_handling_anchor_links_spec.js](cypress/integration/tab_handling_anchor_links_spec.js) how to:

- Test anchor links opening in new tabs: `<a target="_blank">`.
- Test anchor links that link to external domains: `<a href="...">`.
- Prevent content from opening in a new tab.
- Request external content that would open in a new tab using [`cy.request()`](https://on.cypress.io/request).
- Speed up tests by reducing loading times.

For more read:
- [Deal with `target=_blank`](https://glebbahmutov.com/blog/cypress-tips-and-tricks/#deal-with-target_blank)
- [Deal with `window.open`](https://glebbahmutov.com/blog/cypress-tips-and-tricks/#deal-with-windowopen)
