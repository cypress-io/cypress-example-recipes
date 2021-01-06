/* eslint-env browser */

const confirmIt = () => {
  // show the confirm prompt after a delay
  setTimeout(() => {
    window.confirm('Are you sure?')
  }, 1000)
}

document.getElementById('click').addEventListener('click', confirmIt)

document.getElementById('promise').addEventListener('click', () => {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Did not handle this promise')
    }, 1000)
  })
})
