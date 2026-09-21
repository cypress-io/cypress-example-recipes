# Vendored libraries

This recipe has no server of its own — Cypress serves this folder directly —
so the page's libraries live here rather than being resolved from the repo's
`node_modules`. Keeping them local means the tests never reach out to a CDN,
and the version you see in the filename is the version that actually runs.

File | Package
---|---
`jquery-3.5.0.min.js` | [jquery@3.5.0](https://www.npmjs.com/package/jquery/v/3.5.0) `dist/jquery.min.js`
`select2-4.0.13.min.js` | [select2@4.0.13](https://www.npmjs.com/package/select2/v/4.0.13) `dist/js/select2.min.js`
`select2-4.0.13.min.css` | [select2@4.0.13](https://www.npmjs.com/package/select2/v/4.0.13) `dist/css/select2.min.css`

Each file is byte-for-byte the file published in the npm tarball. To refresh
one, `npm pack <package>@<version>`, unpack it, and copy the listed file across
under its versioned name.

jQuery is pinned to the version already declared in the repo's root
`package.json`, so every jQuery in this repo is the same one. Select2 4.0.13
is the release that added jQuery 3.5 support, so the pair matches.
