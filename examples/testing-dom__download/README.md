# Download and validate a file

![File download in Chrome](images/chrome.png)

See [cypress/plugins/index.js](cypress/plugins/index.js) to see how we set the browser preferences to se the download folder and bypass the download modal dialog. See the [cypress/integration/spec.js](cypress/integration/spec.js) spec file that downloads and verifies:
- a CSV file
- an Excel file
- a PNG image
- a TXT file
- a JS file
- a Zip file

![File download in Firefox](images/firefox.png)

Text files are validated right from the browser spec, but the binary files like the downloaded Zip archives need to be validated from Node code using the plugins file.
