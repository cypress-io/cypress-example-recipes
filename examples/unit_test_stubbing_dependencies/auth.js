import api from './api'
import util from './util'

export default class Auth {
  constructor () {
    this.loggedIn = false
    this.userId = null

    api.onUnauth(() => {
      this.loggedIn = false
    })
  }

  login (username, password) {
    return api.login(username, password)
    .then((userId) => {
      this.loggedIn = true
      this.userId = userId
    })
    .catch((error) => {
      util.log(error.message)
    })
  }
}
