/* eslint-env browser */
/* global $ */
window.App = {
  start (data) {
    // simply fill in the text contents of the
    // <pre> element with our data
    $('pre').text(JSON.stringify(data))
  },
}
