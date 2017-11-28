/* global cy */
export const resetDatabase = () => {
  // for complex resets can use NPM script command
  // cy.exec('npm run reset:database')

  // for simple cases, can just overwrite the data file
  const data = {
    todos: []
  }
  const str = JSON.stringify(data)
  cy.writeFile('./data.json', str)
  cy.wait(1000) // gives json-server a chance to reload
}

export const visit = () => cy.visit('/')

export const getTodoApp = () => cy.get('.todoapp')

export const getTodoItems = () =>
  getTodoApp()
    .find('.todo-list')
    .find('li')

export const newId = () =>
  Math.random()
    .toString()
    .substr(2, 10)

// if we expose "newId" factory method from the application
// we can easily stub it. But this is a realistic example of
// stubbing "test window" random number generator
// and "application window" random number generator that is
// running inside the test iframe
export const stubMathRandom = () => {
  // first two digits are disregarded, so our "random" sequence of ids
  // should be '1', '2', '3', ...
  let counter = 101
  cy.stub(Math, 'random').callsFake(() => counter++)
  cy.window().then(win => {
    // inside test iframe
    cy.stub(win.Math, 'random').callsFake(() => counter++)
  })
}

export const makeTodo = (text = 'todo') => {
  const id = newId()
  const title = `${text} ${id}`
  return {
    id,
    title,
    completed: false
  }
}

export const enterTodo = (text = 'example todo') =>
  getTodoApp()
    .find('.new-todo')
    .type(`${text}{enter}`)
