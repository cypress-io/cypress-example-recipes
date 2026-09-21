# Vendored libraries

This recipe has no server of its own — Cypress serves this folder directly —
so Ag-Grid lives here rather than being resolved from the repo's
`node_modules`. Keeping it local means the tests never reach out to a CDN,
and the version you see in the filename is the version that actually runs.

File | Package
---|---
`ag-grid-community-33.2.1.min.js` | [ag-grid-community@33.2.1](https://www.npmjs.com/package/ag-grid-community/v/33.2.1) `dist/ag-grid-community.min.js`

The file is byte-for-byte the file published in the npm tarball. To refresh it,
`npm pack ag-grid-community@<version>`, unpack it, and copy
`dist/ag-grid-community.min.js` across under its versioned name.
