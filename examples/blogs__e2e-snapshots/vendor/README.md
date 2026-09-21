# Vendored libraries

This recipe is served by `json-server --static .`, which only serves this
folder, so the application's libraries live here rather than being resolved
from the repo's `node_modules`. Keeping them local means the tests never
reach out to a CDN, and the version you see in the filename is the version
that actually runs.

File | Package
---|---
`babel-polyfill-6.26.0.min.js` | [babel-polyfill@6.26.0](https://www.npmjs.com/package/babel-polyfill/v/6.26.0) `dist/polyfill.min.js`
`vue-2.5.5.js` | [vue@2.5.5](https://www.npmjs.com/package/vue/v/2.5.5) `dist/vue.js`
`vuex-3.0.1.js` | [vuex@3.0.1](https://www.npmjs.com/package/vuex/v/3.0.1) `dist/vuex.js`
`axios-0.17.1.min.js` | [axios@0.17.1](https://www.npmjs.com/package/axios/v/0.17.1) `dist/axios.min.js`
`todomvc-app-css-2.0.4.css` | [todomvc-app-css@2.0.4](https://www.npmjs.com/package/todomvc-app-css/v/2.0.4) `index.css`

Each file is byte-for-byte the file published in the npm tarball. To refresh
one, `npm pack <package>@<version>`, unpack it, and copy the listed file across
under its versioned name.
