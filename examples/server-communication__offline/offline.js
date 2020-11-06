/* global window, document, fetch */
/* eslint-disable no-console */
document.getElementById('load-users').addEventListener('click', () => {
  console.log('loading users')
  document.querySelector('#users').innerText = ''

  fetch('https://jsonplaceholder.cypress.io/users?_limit=3')
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
})

const updateNetworkStatus = () => {
  const el = document.getElementById('network-status')
  const text = window.navigator.onLine ? '🟢 online' : '🟥 offline'

  el.innerText = text
}

updateNetworkStatus()
window.addEventListener('offline', updateNetworkStatus)
window.addEventListener('online', updateNetworkStatus)
