// type definitions for Cypress and the custom commands like "createDefaultTodos"
/// <reference types="../support" />

// @ts-check
import {
  addDefaultTodos,
  addTodos,
  allItems,
  TODO_ITEM_ONE,
  TODO_ITEM_THREE,
  TODO_ITEM_TWO,
  toggle,
} from './utils'

describe('TodoMVC', function () {
  beforeEach(function () {
    cy.visit('/')
  })

  afterEach(() => {
    // In firefox, blur handlers will fire upon navigation if there is an activeElement.
    // Since todos are updated on blur after editing,
    // this is needed to blur activeElement after each test to prevent state leakage between tests.
    cy.window().then((win) => {
      // @ts-ignore
      win.document.activeElement.blur()
    })
  })

  context('When page is initially opened', function () {
    it('should focus on the todo input field', function () {
      // get the currently focused element and assert
      // that it has class='new-todo'
      //
      // http://on.cypress.io/focused
      cy.focused().should('have.class', 'new-todo')
    })
  })

  context('No Todos', function () {
    it('should hide #main and #footer', function () {
      // Unlike the TodoMVC tests, we don't need to create
      // a gazillion helper functions which are difficult to
      // parse through. Instead we'll opt to use real selectors
      // so as to make our testing intentions as clear as possible.
      //
      // http://on.cypress.io/get
      allItems().should('not.exist')
      cy.get('.main').should('not.exist')
      cy.get('.footer').should('not.exist')
    })
  })

  context('New Todo', function () {
    // These tests confirm that add new Todo items works.
    // All tests go through the DOM and events just like a real user would.

    // Input element selector for typing new todo title
    const NEW_TODO = '.new-todo'

    it('should allow me to add todo items', function () {
      cy.get(NEW_TODO)
      .type(TODO_ITEM_ONE)
      .type('{enter}')

      allItems()
      .eq(0)
      .find('label')
      .should('contain', TODO_ITEM_ONE)

      cy.get(NEW_TODO)
      .type(TODO_ITEM_TWO)
      .type('{enter}')

      allItems()
      .eq(1)
      .find('label')
      .should('contain', TODO_ITEM_TWO)
    })

    it('adds items', function () {
      // create several todos then check the number of items in the list
      cy.get(NEW_TODO)
      .type('todo A{enter}')
      .type('todo B{enter}') // we can continue working with same element
      .type('todo C{enter}') // and keep adding new items
      .type('todo D{enter}')

      allItems().should('have.length', 4)
    })

    it('should clear text input field when an item is added', function () {
      cy.get(NEW_TODO)
      .type(TODO_ITEM_ONE)
      .type('{enter}')

      cy.get(NEW_TODO).should('have.text', '')
    })

    it('should append new items to the bottom of the list', function () {
      // this is an example of a custom command
      // which is stored in tests/_support/spec_helper.js
      // you should open up the spec_helper and look at
      // the comments!
      cy.createDefaultTodos().as('todos')

      // even though the text content is split across
      // multiple <span> and <strong> elements
      // `cy.contains` can verify this correctly
      cy.get('.todo-count').contains('3 items left')

      allItems()
      .eq(0)
      .find('label')
      .should('contain', TODO_ITEM_ONE)

      allItems()
      .eq(1)
      .find('label')
      .should('contain', TODO_ITEM_TWO)

      allItems()
      .eq(2)
      .find('label')
      .should('contain', TODO_ITEM_THREE)
    })

    it('should trim text input', function () {
      // this is an example of another custom command
      // since we repeat the todo creation over and over
      // again. It's up to you to decide when to abstract
      // repetitive behavior and roll that up into a custom
      // command vs explicitly writing the code.
      cy.createTodo(`    ${TODO_ITEM_ONE}    `)

      // we use as explicit assertion here about the text instead of
      // using 'contain' so we can specify the exact text of the element
      // does not have any whitespace around it
      allItems()
      .eq(0)
      .should('have.text', TODO_ITEM_ONE)
    })

    it('should show #main and #footer when items added', function () {
      cy.createTodo(TODO_ITEM_ONE)
      cy.get('.main').should('be.visible')
      cy.get('.footer').should('be.visible')
    })
  })

  context('Adds items (spy example)', () => {
    it('calls inform', () => {
      cy.window()
      .its('model')
      .should('be.an', 'object')
      .then((model) => {
        cy.spy(model, 'inform').as('inform')
      })

      addDefaultTodos()
      cy.get('@inform').should('have.been.calledOnce')
    })
  })

  context('Mark all as completed', function () {
    // These tests confirm that we can click one toggle button, and the app
    // marks all items as completed or incomplete again.

    // Selector for the toggle button we are going to use
    const TOGGLE_ALL = '.toggle-all'

    // Note that these tests do NOT create items through the DOM.
    // Instead they use app action "addDefaultTodos" before each test
    beforeEach(addDefaultTodos)

    it('should allow me to mark all items as completed', function () {
      // complete all todos
      // we use 'check' instead of 'click'
      // because that indicates our intention much clearer
      cy.get(TOGGLE_ALL).check()

      // get each todo li and ensure its class is 'completed'
      allItems()
      .eq(0)
      .should('have.class', 'completed')

      allItems()
      .eq(1)
      .should('have.class', 'completed')

      allItems()
      .eq(2)
      .should('have.class', 'completed')
    })

    it('should allow me to clear the complete state of all items', function () {
      // check and then immediately uncheck
      cy.get(TOGGLE_ALL)
      .check()
      .uncheck()

      allItems()
      .eq(0)
      .should('not.have.class', 'completed')

      allItems()
      .eq(1)
      .should('not.have.class', 'completed')

      allItems()
      .eq(2)
      .should('not.have.class', 'completed')
    })

    it('complete all checkbox should update state when items are completed / cleared', function () {
      // alias the .toggle-all for reuse later
      cy.get(TOGGLE_ALL)
      .as('toggleAll')
      .check()
      // this assertion is silly here IMO but
      // it is what TodoMVC does
      .should('be.checked')

      toggle(0)

      // reference the .toggle-all element again
      // and make sure its not checked
      cy.get('@toggleAll').should('not.be.checked')

      toggle(0)

      // assert the toggle all is checked again
      cy.get('@toggleAll').should('be.checked')
    })
  })

  context('Item', function () {
    it('should allow me to mark items as complete', function () {
      cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
      cy.createTodo(TODO_ITEM_TWO).as('secondTodo')

      cy.get('@firstTodo')
      .find('.toggle')
      .check()

      cy.get('@firstTodo').should('have.class', 'completed')

      cy.get('@secondTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo')
      .find('.toggle')
      .check()

      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('have.class', 'completed')
    })

    it('should allow me to un-mark items as complete', function () {
      cy.createTodo(TODO_ITEM_ONE).as('firstTodo')
      cy.createTodo(TODO_ITEM_TWO).as('secondTodo')

      cy.get('@firstTodo')
      .find('.toggle')
      .check()

      cy.get('@firstTodo').should('have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')

      cy.get('@firstTodo')
      .find('.toggle')
      .uncheck()

      cy.get('@firstTodo').should('not.have.class', 'completed')
      cy.get('@secondTodo').should('not.have.class', 'completed')
    })

    it('should allow me to edit an item', function () {
      cy.createDefaultTodos()

      allItems()
      .eq(1)
      .as('secondTodo')
      // TODO: fix this, dblclick should
      // have been issued to label
      .find('label')
      .dblclick()

      // clear out the inputs current value
      // and type a new value
      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('buy some sausages')
      .type('{enter}')

      // explicitly assert about the text value
      allItems()
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      cy.get('@secondTodo').should('contain', 'buy some sausages')
      allItems()
      .eq(2)
      .should('contain', TODO_ITEM_THREE)
    })
  })

  context('Editing', function () {
    beforeEach(addDefaultTodos)

    it('should hide other controls when editing', function () {
      allItems()
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.toggle')
      .should('not.be.visible')

      cy.get('@secondTodo')
      .find('label')
      .should('not.be.visible')
    })

    it('should save edits on blur', function () {
      allItems()
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('buy some sausages')
      // we can just send the blur event directly
      // to the input instead of having to click
      // on another button on the page. though you
      // could do that its just more mental work
      .blur()

      allItems()
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      cy.get('@secondTodo').should('contain', 'buy some sausages')
      allItems()
      .eq(2)
      .should('contain', TODO_ITEM_THREE)
    })

    it('should trim entered text', function () {
      allItems()
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('    buy some sausages    ')
      .type('{enter}')

      allItems()
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      cy.get('@secondTodo').should('contain', 'buy some sausages')
      allItems()
      .eq(2)
      .should('contain', TODO_ITEM_THREE)
    })

    it('should remove the item if an empty text string was entered', function () {
      allItems()
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('{enter}')

      allItems().should('have.length', 2)
    })

    it('should cancel edits on escape', function () {
      allItems()
      .eq(1)
      .as('secondTodo')
      .find('label')
      .dblclick()

      cy.get('@secondTodo')
      .find('.edit')
      .clear()
      .type('foo{esc}')

      allItems()
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      allItems()
      .eq(1)
      .should('contain', TODO_ITEM_TWO)

      allItems()
      .eq(2)
      .should('contain', TODO_ITEM_THREE)
    })
  })

  context('Counter', function () {
    const COUNTER = '.todo-count'

    it('should display the current number of todo items', function () {
      addTodos(TODO_ITEM_ONE)
      cy.get(COUNTER).contains('1 item left')
      addTodos(TODO_ITEM_TWO)
      cy.get(COUNTER).contains('2 items left')
    })
  })

  context('Clear completed button', function () {
    const CLEAR_COMPLETED = '.clear-completed'

    beforeEach(addDefaultTodos)

    it('should display the correct text', function () {
      toggle(0)
      cy.get(CLEAR_COMPLETED).contains('Clear completed')
    })

    it('should remove completed items when clicked', function () {
      toggle(1)
      cy.get(CLEAR_COMPLETED).click()
      allItems().should('have.length', 2)
      allItems()
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      allItems()
      .eq(1)
      .should('contain', TODO_ITEM_THREE)
    })

    it('should be hidden when there are no items that are completed', function () {
      toggle(1)
      cy.get(CLEAR_COMPLETED)
      .should('be.visible')
      .click()

      cy.get(CLEAR_COMPLETED).should('not.exist')
    })
  })

  context('Persistence', function () {
    // mimicking TodoMVC tests
    // by writing out this function
    function testState () {
      allItems()
      .eq(0)
      .should('contain', TODO_ITEM_ONE)
      .and('have.class', 'completed')

      allItems()
      .eq(1)
      .should('contain', TODO_ITEM_TWO)
      .and('not.have.class', 'completed')
    }

    it('should persist its data', function () {
      addTodos(TODO_ITEM_ONE, TODO_ITEM_TWO)
      toggle(0)
      .then(testState)
      .reload()
      .then(testState)
    })
  })

  context('Routing', function () {
    /**
     * Little utility function to click on a given filter on the page.
     * We are testing routing links, so these tests go through the DOM.
     */
    const clickFilter = (name) => {
      return cy
      .get('.filters')
      .contains(name)
      .click()
    }

    // but for everything else, like created todos and toggling, these tests
    // use app actions.
    beforeEach(addDefaultTodos)

    it('should allow me to display active items', function () {
      toggle(1)
      // the UI feature we are actually testing - the "Active" link
      clickFilter('Active')
      allItems()
      .eq(0)
      .should('contain', TODO_ITEM_ONE)

      allItems()
      .eq(1)
      .should('contain', TODO_ITEM_THREE)
    })

    it('should respect the back button', function () {
      toggle(1)
      clickFilter('Active')
      clickFilter('Completed')
      allItems().should('have.length', 1)
      cy.go('back')
      allItems().should('have.length', 2)
      cy.go('back')
      allItems().should('have.length', 3)
    })

    it('should allow me to display completed items', function () {
      toggle(1)
      clickFilter('Completed')
      allItems().should('have.length', 1)
    })

    it('should allow me to display all items', function () {
      toggle(1)
      clickFilter('Active')
      clickFilter('Completed')
      clickFilter('All')
      allItems().should('have.length', 3)
    })

    it('should highlight the currently applied filter', function () {
      // using a within here which will automatically scope
      // nested 'cy' queries to our parent element <ul.filters>
      cy.get('.filters').within(function () {
        cy.contains('All').should('have.class', 'selected')
        cy.contains('Active')
        .click()
        .should('have.class', 'selected')

        cy.contains('Completed')
        .click()
        .should('have.class', 'selected')
      })
    })
  })
})
