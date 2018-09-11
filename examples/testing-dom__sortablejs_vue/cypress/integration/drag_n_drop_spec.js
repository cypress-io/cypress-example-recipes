// This recipe shows how to use cy.trigger to test
// drag-n-drop interaction

const moveItemFromFirstListToTopOfSecondList = function (sourceIndex) {
  const source = `.first-list li:nth-child(${sourceIndex + 1})`
  const target = '.second-list'
  cy.get(source).drop(target, 'top')
}

const expectListItemsToBeEqualTo = function (listItemsSelector, expected) {
  cy.get(listItemsSelector).should('have.length', expected.length)
  .each(($item, index) => {
    expect($item).to.contain(expected[index])
  })
}

describe('Drag n Drop', function () {
  // This tests an example that uses vuedraggable / sortable.js, which, under the hood,
  // binds to mousedown, dragstart, dragover, drop and mouseup events
  beforeEach(() => {
    cy.visit('/')
  })

  it('can move an item down within a list', function () {
    const source = '.first-list li:first'
    const listSelector = '.first-list'
    const itemsSelector = 'li'
    const targetIndex = 3
    // the drop command is defined in ../support/commands.js
    cy.get(source).drop(listSelector, { itemsSelector, targetIndex })
    expectListItemsToBeEqualTo('.first-list li', [
      'draggable',
      'component',
      'for',
      'vue.draggable',
      'vue.js 2.0',
      'based',
      'on',
      'Sortablejs',
    ])
  })

  it('can move an item up within a list', function () {
    const source = '.first-list li:nth-child(3)'
    const listSelector = '.first-list'
    const itemsSelector = 'li'
    const targetIndex = 1
    // the drop command is defined in ../support/commands.js
    cy.get(source).drop(listSelector, { itemsSelector, targetIndex })
    expectListItemsToBeEqualTo('.first-list li', [
      'vue.draggable',
      'component',
      'draggable',
      'for',
      'vue.js 2.0',
      'based',
      'on',
      'Sortablejs',
    ])
  })

  it('can move an item to the top within a list', function () {
    const source = '.first-list li:nth-child(3)'
    const listSelector = '.first-list'
    const itemsSelector = 'li'
    const targetIndex = 0
    // the drop command is defined in ../support/commands.js
    cy.get(source).drop(listSelector, { itemsSelector, targetIndex })
    expectListItemsToBeEqualTo('.first-list li', [
      'component',
      'vue.draggable',
      'draggable',
      'for',
      'vue.js 2.0',
      'based',
      'on',
      'Sortablejs',
    ])
  })

  it('can move an item to the bottom within a list', function () {
    const source = '.first-list li:nth-child(3)'
    const listSelector = '.first-list'
    const itemsSelector = 'li'
    const targetIndex = 7
    // the drop command is defined in ../support/commands.js
    cy.get(source).drop(listSelector, { itemsSelector, targetIndex })
    expectListItemsToBeEqualTo('.first-list li', [
      'vue.draggable',
      'draggable',
      'for',
      'vue.js 2.0',
      'based',
      'on',
      'Sortablejs',
      'component',
    ])
  })

  it('can move an item to another list', function () {
    moveItemFromFirstListToTopOfSecondList(0)
    expectListItemsToBeEqualTo('.first-list li', [
      'draggable',
      'component',
      'for',
      'vue.js 2.0',
      'based',
      'on',
      'Sortablejs',
    ])
    expectListItemsToBeEqualTo('.second-list li', [
      'vue.draggable',
    ])
  })

  it('can move an item to another list in a specific position', function () {
    // prepare the second list with some items
    moveItemFromFirstListToTopOfSecondList(2)
    moveItemFromFirstListToTopOfSecondList(1)
    moveItemFromFirstListToTopOfSecondList(0)

    // verify the list states before we continue
    expectListItemsToBeEqualTo('.first-list li', [
      'for',
      'vue.js 2.0',
      'based',
      'on',
      'Sortablejs',
    ])
    expectListItemsToBeEqualTo('.second-list li', [
      'vue.draggable',
      'draggable',
      'component',
    ])

    // make the first item in the first list the second item in the second list
    const source = '.first-list li:first'
    const listSelector = '.second-list'
    const itemsSelector = 'li'
    const targetIndex = 1
    // the drop command is defined in ../support/commands.js
    cy.get(source).drop(listSelector, { itemsSelector, targetIndex })

    expectListItemsToBeEqualTo('.first-list li', [
      'vue.js 2.0',
      'based',
      'on',
      'Sortablejs',
    ])
    expectListItemsToBeEqualTo('.second-list li', [
      'vue.draggable',
      'for',
      'draggable',
      'component',
    ])
  })
})
