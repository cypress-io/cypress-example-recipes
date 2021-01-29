/* eslint-env browser */
document
.getElementById('click-me')
.addEventListener('click', () => {
/* global Analytics */
  if (window.Analytics) {
    window.Analytics.sendEvent('click', 'button#click-me')
  }
})
