const write = require('fs').writeFileSync

const resetDatabase = () => {
  // for complex resets can use NPM script command
  // cy.exec('npm run reset:database')

  // for simple cases, can just overwrite the data file
  const data = {
    todos: []
  }
  const str = JSON.stringify(data, null, 2) + '\n'
  write('./data.json', str)
}

resetDatabase()
