// this is one of the (possibly 3rd party) modules that
// our app depends on. the implementation doesn't really matter,
// as we stub out this behavior in our test anyway

export default {
  login (username, password) {
    // send request to log user in
  },

  onUnauth (callback) {
    // monitor api and call callback when auth expires
  },
}
