/* global window, document, fetch */
/* eslint-disable no-console */
function updateFavoriteFruits (contents) {
  if (typeof contents !== 'string') {
    contents = contents.map((item) => `<li>${item}</li>`).join('')
  }

  document.querySelector('.favorite-fruits').innerHTML = contents
}

function getFavoriteFruits () {
  const favFruits = document.querySelector('.favorite-fruits')

  if (!favFruits) {
    return
  }

  favFruits.innerHTML = '<div class="loader"></div>'

  fetch('/favorite-fruits', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  })
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
    // using delay parameter to make sure our tests
    // are solid and can handle the Ajax request firing after a delay
    setTimeout(() => {
      console.log('loading %d users', nUsers)
      document.querySelector('#users').innerText = ''

      fetch(`https://jsonplaceholder.cypress.io/users?_limit=${nUsers}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })
      .then((r) => {
        if (!r.ok) {
          throw new Error(r.statusText)
        }

        return r.json()
      })
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
    }, 200)
  }
}

const loadUser = (id) => {
  return () => {
    console.log('loading user #%d', id)
    document.querySelector('#users').innerText = ''

    fetch(`https://jsonplaceholder.cypress.io/users/${id}`)
    .then((r) => r.json())
    .then((user) => {
      const users = [user]

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

function postUser () {
  const user = {
    id: 101,
    name: 'Joe Smith',
  }

  return fetch('https://jsonplaceholder.cypress.io/users', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
}

function putUser () {
  const user = {
    id: 101,
    name: 'Joe Smith',
  }

  return fetch('https://jsonplaceholder.cypress.io/users/1', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  })
}

if (document.getElementById('load-users')) {
  document.getElementById('load-users').addEventListener('click', loadUsers(3))
}

if (document.getElementById('load-five-users')) {
  document.getElementById('load-five-users').addEventListener('click', loadUsers(5))
}

if (document.getElementById('load-second-user')) {
  document.getElementById('load-second-user').addEventListener('click', loadUser(2))
}

const postUserButton = document.getElementById('post-user')

if (postUserButton) {
  postUserButton.addEventListener('click', postUser)
}

const updateUserButton = document.getElementById('put-user')

if (updateUserButton) {
  updateUserButton.addEventListener('click', putUser)
}

const updateNetworkStatus = () => {
  const el = document.getElementById('network-status')

  if (!el) {
    return
  }

  const text = window.navigator.onLine ? '🟢 online' : '🟥 offline'

  el.innerText = text
}

updateNetworkStatus()
window.addEventListener('offline', updateNetworkStatus)
window.addEventListener('online', updateNetworkStatus)

if (document.getElementById('get-headers')) {
  document.getElementById('get-headers').addEventListener('click', () => {
    fetch('/req-headers')
    .then((r) => r.json())
    .then((headers) => {
      const output = document.getElementById('output')

      output.innerText = JSON.stringify(headers, null, 2)
    })
  })
}
