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
`bootstrap-vue-1.5.1.js` | [bootstrap-vue@1.5.1](https://www.npmjs.com/package/bootstrap-vue/v/1.5.1) `dist/bootstrap-vue.js`
`bootstrap-vue-1.5.1.css` | [bootstrap-vue@1.5.1](https://www.npmjs.com/package/bootstrap-vue/v/1.5.1) `dist/bootstrap-vue.css`
`bootstrap-3.3.7.min.css` | [bootstrap@3.3.7](https://www.npmjs.com/package/bootstrap/v/3.3.7) `dist/css/bootstrap.min.css`
`todomvc-app-css-2.0.4.css` | [todomvc-app-css@2.0.4](https://www.npmjs.com/package/todomvc-app-css/v/2.0.4) `index.css`

Each file is byte-for-byte the file published in the npm tarball. To refresh
one, `npm pack <package>@<version>`, unpack it, and copy the listed file across
under its versioned name.

## Note on Bootstrap's fonts

`bootstrap-3.3.7.min.css` carries an `@font-face` rule pointing at
`../fonts/glyphicons-halflings-regular.*`. The glyphicon fonts are not
vendored because this recipe renders no glyphicons, so the browser never
requests them. Add a `fonts/` folder next to this one if that ever changes.
