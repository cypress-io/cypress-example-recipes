/* eslint-env browser */
/* eslint-disable no-console */
document.querySelector('input[type=color]').addEventListener('change', (e) => {
  console.log('setting new background color to: %s', e.target.value)
  document.documentElement.style.setProperty('--background-color', e.target.value)
})
