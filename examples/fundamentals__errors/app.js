/* eslint-env browser */

/* eslint-disable no-console */
document.getElementById('error').addEventListener('click', () => {
  console.log('application will throw an error in 1 second')
  setTimeout(() => {
    console.log('application is about to throw an error')
    throw new Error('Things went bad')
  }, 1000)
})

document.getElementById('promise').addEventListener('click', () => {
  console.log('application with NOT handle a rejected promise in 1 second')
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('application is about to reject a promise')
      // important: reject with an Error object
      reject(new Error('Did not handle this promise'))
    }, 1000)
  })
})
