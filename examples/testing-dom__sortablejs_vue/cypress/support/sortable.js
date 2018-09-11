/**
 * Performs a drag and drop operation on a sortable.js element.
 * Sources are dragged from the center and dropped onto the target
 * based on the given position.
 * 
 * @param {HTMLElement} source The element that will be dragged onto the target.
 * @param {HTMLElement} target The element upon which the source will be dropped.
 * @param {string} position The relative position upon which the source is dropped.
 */
export function dragNDrop(source, target, position) {
  // start dragging the source element
  cy.wrap(source)
    .trigger('mousedown', { which: 1, button: 0 })
    .trigger('dragstart')

  const $target = cy.wrap(target)

  // drag over & drop
  if (position === 'bottom' || position === 'right') {
    // if dragging to the bottom or right, simulate a drag over the target element
    // from top to bottom, or left to right.
    $target
      .trigger('dragover', position === 'bottom' ? 'top' : 'left')
      .trigger('dragover', 'center')
      .trigger('dragover', position)
  } else {
    // if not dragging to the top or left, we can just pass in the current position
    $target
      .trigger('dragover', position)
  }

  // drop the source on the target
  $target
    .trigger('drop', position)
    .trigger('mouseup', { which: 1, button: 0 })
}

/**
 * Implements an element-based command extension for cypress. Handles move and sort.
 * 
 * @param {HTMLElement} $source Source element. Typically received from cy.get.
 * @param {String} targetSelector Selector that identifies a single target upon which to drop the source.
 * @param {Object} options Position used when dropping the target ('top', 'bottom', 'left', 'right') or an options object.
 * @param {String} options.itemsSelector Selector returning a list of items. Ex: 'ul > li'.
 * @param {Number} options.targetIndex Desired index to insert the source into when dropped.
*/
export function dropCommand($source, targetSelector, options) {
  const position = typeof options === 'string' ? options : undefined
  const { itemsSelector, targetIndex } = typeof options === 'object' ? options : {}
  cy.get(targetSelector).then($target => {
    if (itemsSelector) {
      const list = $target[0]
      const items = [].slice.call(list.querySelectorAll(itemsSelector))
      const item = $source[0]
      const currentIndex = items.findIndex(i => i === item)
      // if the target index is equal to the current index, do nothing
      if (targetIndex === currentIndex) return
      if (currentIndex === -1) {
        // special case for when the item is not found
        if (targetIndex === items.length) {
          // if the target index is the last index, move to the bottom of the drag area
          dragNDrop($source, $target, 'bottom')
        } else {
          // if the target index is less than the current index, choose target - 1
          dragNDrop($source, items[targetIndex], 'top')
        }
      } else if (targetIndex === 0) {
        // if the target index is 0, move to the top of the drag area
        dragNDrop($source, $target, 'top')
      } else if (targetIndex === items.length - 1) {
        // if the target index is the last index, move to the bottom of the drag area
        dragNDrop($source, $target, 'bottom')
      } else if (targetIndex < currentIndex) {
        // if the target index is less than the current index, choose target - 1
        dragNDrop($source, items[targetIndex], 'top')
      } else if (targetIndex > currentIndex) {
        // if the target index is more than the current index, choose target + 1
        dragNDrop($source, items[targetIndex + 1])
      }
    } else {
      dragNDrop($source, $target, position)
    }
  })
}