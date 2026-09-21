# Vendored libraries

This recipe has no server of its own — Cypress serves this folder directly —
so jQuery lives here rather than being resolved from the repo's
`node_modules`. Keeping it local means the tests never reach out to a CDN,
and the version you see in the filename is the version that actually runs.

File | Package
---|---
`jquery-3.5.0.min.js` | [jquery@3.5.0](https://www.npmjs.com/package/jquery/v/3.5.0) `dist/jquery.min.js`

The file is byte-for-byte the file published in the npm tarball. To refresh it,
`npm pack jquery@<version>`, unpack it, and copy `dist/jquery.min.js` across
under its versioned name.

jQuery is pinned to the version already declared in the repo's root
`package.json`, so every jQuery in this repo is the same one. The page
previously loaded jQuery 1.8.2 from a CDN; `pagination.js` 2.1.4 supports
jQuery 1.7.2 and newer, so nothing about the pagination behaviour changes.
