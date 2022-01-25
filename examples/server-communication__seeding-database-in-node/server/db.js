const fs = require('fs-extra')
const path = require('path')

const filePath = path.join(__dirname, 'db.json')

function seed (data) {
  return fs.outputJson(filePath, data)
}

function getPosts () {
  return fs.readJson(filePath)
  .then((data = {}) => {
    return data.posts
  })
}

module.exports = {
  seed,
  getPosts,
}
