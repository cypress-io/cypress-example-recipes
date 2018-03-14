import fs from 'fs-extra'
import path from 'path'

const filePath = path.join(__dirname, 'db.json')

export function seed (data) {
  return fs.outputJson(filePath, data)
}

export function getPosts () {
  return fs.readJson(filePath)
  .then((data = {}) => {
    return data.posts
  })
}
