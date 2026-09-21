# vendor

Third-party browser code used by [index.html](../index.html), vendored so the recipe
has no runtime CDN dependency and always runs against a known version.

| File | Source | Version |
|---|---|---|
| `clipboard-copy-element-1.3.2.js` | [`@github/clipboard-copy-element`](https://www.npmjs.com/package/@github/clipboard-copy-element) `dist/bundle.js` | 1.3.2 |
| `tiny-toast-1.2.0.js` | [`tiny-toast`](https://www.npmjs.com/package/tiny-toast) `dist/tiny-toast.js` | 1.2.0 |

To update one, pack the new version and copy the file out, renaming it to carry the version:

```shell
npm pack @github/clipboard-copy-element@<version>
tar -xzf github-clipboard-copy-element-<version>.tgz
cp package/dist/bundle.js vendor/clipboard-copy-element-<version>.js
```

Then point the `<script>` tag in [index.html](../index.html) at the new filename.
