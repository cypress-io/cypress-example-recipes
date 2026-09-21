# Vendored libraries

This recipe has no server of its own — Cypress serves this folder directly —
so the page's libraries live here rather than being resolved from the repo's
`node_modules`. Keeping them local means the tests never reach out to a CDN,
and the version you see in the filename is the version that actually runs.

File | Package
---|---
`clipboard-copy-element-1.1.2.js` | [@github/clipboard-copy-element@1.1.2](https://www.npmjs.com/package/@github/clipboard-copy-element/v/1.1.2) `dist/index.umd.js`
`tiny-toast-1.2.0.js` | [tiny-toast@1.2.0](https://www.npmjs.com/package/tiny-toast/v/1.2.0) `dist/tiny-toast.js`

Each file is byte-for-byte the file published in the npm tarball. To refresh
one, `npm pack <package>@<version>`, unpack it, and copy the listed file across
under its versioned name.

`@github/clipboard-copy-element` is pinned to the version already declared in
the repo's root `package.json`, so the two agree.
