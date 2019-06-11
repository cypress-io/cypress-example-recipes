# Stubbing Google Analytics

This is an example showing how to blacklist requests for `www.google-analytics.com`.

Even though we are preventing the actual `GA` script from loading, we can still stub the `window.ga` object and ensure its being called correctly.

- Use [`blacklistHosts`](https://on.cypress.io/configuration#Browser) to block Google Analytics from receiving requests.
- Use [`cy.stub()`](https://on.cypress.io/stub) to verify that `window.ga(...)` was called with the correct arguments

## Network Requests

This shows how the script is being blocked with a `503` server response code.

![screen shot 2017-12-14 at 2 28 49 pm](https://user-images.githubusercontent.com/1268976/34010643-776e6550-e0db-11e7-8570-448e62354e6d.png)

The response headers also include the rule that caused the blockage.

![screen shot 2017-12-14 at 2 28 26 pm](https://user-images.githubusercontent.com/1268976/34010688-9acdcedc-e0db-11e7-9f3e-5841a332b677.png)
