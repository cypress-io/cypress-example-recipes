/* eslint-env browser */
document
.getElementById('click-me')
.addEventListener('click', () => {
  /* global Analytics */
  Analytics.sendEvent('click', 'button#click-me')
})
