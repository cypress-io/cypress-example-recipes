/* global window, document, fetch */
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

const loadUsers = (nUsers = 3) => {
  return () => {
    console.log('loading %d users', nUsers)
    document.querySelector('#users').innerText = ''

    fetch(`https://jsonplaceholder.cypress.io/users?_limit=${nUsers}`)
    .then((r) => r.json())
    .then((users) => {
      console.table(users)

      const usersHtml = users.map((user) => {
        return `<li class="user">${user.id} - ${user.email}</li>`
      }).join('\n')

      document.querySelector('#users').innerHTML = usersHtml
    })
    .catch((e) => {
      console.error('problem fetching users', e)
      document.querySelector('#users').innerText = `Problem fetching users ${e.message}`
    })
  }
}

document.getElementById('load-users').addEventListener('click', loadUsers(3))
document.getElementById('load-five-users').addEventListener('click', loadUsers(5))

const updateNetworkStatus = () => {
  const el = document.getElementById('network-status')
  const text = window.navigator.onLine ? '🟢 online' : '🟥 offline'

  el.innerText = text
}

updateNetworkStatus()
window.addEventListener('offline', updateNetworkStatus)
window.addEventListener('online', updateNetworkStatus)
