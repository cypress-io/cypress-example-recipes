/* eslint-disable no-console */
export const resetDatabase = () => {
  console.log('resetDatabase')
  cy.request({
    method: 'POST',
    url: '/reset',
    body: {
      todos: [],
    },
  })
}

export const visit = (skipWaiting) => {
  console.log('visit this =', this)

  if (typeof skipWaiting !== 'boolean') {
    skipWaiting = false
  }

  const waitForInitialLoad = !skipWaiting

  console.log('visit will wait for initial todos', waitForInitialLoad)
  if (waitForInitialLoad) {
    cy.server()
    cy.route('/todos').as('initialTodos')
  }

  cy.visit('/')
  console.log('cy.visit /')
  if (waitForInitialLoad) {
    console.log('waiting for initial todos')
    cy.wait('@initialTodos')
  }
}

export const getTodoApp = () => cy.get('.todoapp')

export const getTodoItems = () => getTodoApp().find('.todo-list li')

export const newId = () => Math.random().toString().substr(2, 10)

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
  cy.window().then((win) => {
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
    completed: false,
  }
}

export const getNewTodoInput = () => getTodoApp().find('.new-todo')

export const enterTodo = (text = 'example todo') => {
  console.log('entering todo', text)

  getNewTodoInput().type(`${text}{enter}`)
  console.log('typed', text)

  // we need to make sure the store and the vue component
  // get updated and the DOM is updated.
  // quick check - the new text appears at the last position
  // I am going to use combined selector to always grab
  // the element and not use stale reference from previous chain call
  const lastItem = '.todoapp .todo-list li:last'

  cy.get(lastItem).should('contain', text)
}

const TODO_ITEM_SELECTOR = '.todoapp .todo-list li'

export const getTodo = (text) => cy.contains(TODO_ITEM_SELECTOR, text)

const getTodoItemCheckbox = (text) => getTodo(text).find('[type="checkbox"]')

export const toggle = (text) => getTodoItemCheckbox(text).click()

export const getCompleted = () => cy.get('.todoapp .todo-list li.completed')
