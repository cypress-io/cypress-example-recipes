/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
// Portal target container.
window.container = document.getElementById('container');
let hasInjectedStyles = false; // DevTools styles are injected into the top-level document head (where the main React app is rendered).
// This method copies those styles to the child window where each panel (e.g. Elements, Profiler) is portaled.

window.injectStyles = getLinkTags => {
  if (!hasInjectedStyles) {
    hasInjectedStyles = true;
    const linkTags = getLinkTags(); // eslint-disable-next-line no-for-of-loops/no-for-of-loops

    for (const linkTag of linkTags) {
      document.head.appendChild(linkTag);
    }
  }
};
/******/ })()
;