/* global document, fetch */
/* eslint-disable no-console */
function updateFavoriteFruits (contents) {
  if (typeof contents !== 'string') {
    contents = contents.map((item) => `<li>${item}</li>`).join('')
  }

  document.querySelector('.favorite-fruits').innerHTML = contents
}

function getFavoriteFruits () {
  document.querySelector('.favorite-fruits').innerHTML = '<div class="loader"></div>'

  fetch('/favorite-fruits')
  .then((response) => {
    /* eslint-disable-next-line no-console */
    console.log('fetch response', response)
    if (response.ok) {
      return response.json()
    }

    const errorMessage = response.headers.get('status-text') || response.statusText

    throw new Error(errorMessage)
  })
  .then((response) => {
    /* eslint-disable-next-line no-console */
    console.log('server response', response)
    updateFavoriteFruits(response.length ? response : 'No favorites')
  })
  .catch((error) => {
    updateFavoriteFruits(`Failed loading favorite fruits: ${error.message}`)
  })
}

getFavoriteFruits()
setInterval(getFavoriteFruits, 30000)

document.getElementById('load-users').addEventListener('click', () => {
  console.log('loading users')
  fetch('https://jsonplaceholder.cypress.io/users?_limit=3')
  .then((r) => r.json())
  .then((users) => {
    console.table(users)

    const usersHtml = users.map((user) => {
      return `<li class="user">${user.id} - ${user.email}</li>`
    }).join('\n')

    document.querySelector('#users').innerHTML = usersHtml
  })
})
