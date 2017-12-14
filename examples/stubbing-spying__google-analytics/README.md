# Direct Control AngularJS

This is an example showing how to blacklist requests for `www.google-analytics.com` and additionally how to stub on the `window.ga` object so you can ensure its being called correctly.

## Network Requests

This shows how the script is being blocked with a `503` server response code.

![screen shot 2017-12-14 at 2 28 49 pm](https://user-images.githubusercontent.com/1268976/34010643-776e6550-e0db-11e7-8570-448e62354e6d.png)

The response headers also include the rule that caused the blockage.

![screen shot 2017-12-14 at 2 28 26 pm](https://user-images.githubusercontent.com/1268976/34010688-9acdcedc-e0db-11e7-9f3e-5841a332b677.png)
