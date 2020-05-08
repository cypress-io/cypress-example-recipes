/* eslint-env browser */

/**
 * Wraps the given class constructor to keep track of the
 * created object and set it on the window object.
 */
export function CypressSingleton (name) {
  return function (target) {
    // @ts-ignore
    if (!window.Cypress) {
      return target
    }

    // save a reference to the original constructor
    const original = target

    // a utility function to generate instances of a class
    function construct (constructor, args) {
      const c = function () {
        return constructor.apply(this, args)
      }

      c.prototype = constructor.prototype

      return new c()
    }

    // the new constructor behavior
    const f = function (...args) {
      const instance = construct(original, args)

      // @ts-ignore
      window[name || target.name] = instance

      return instance
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype

    return f
  }
}

/**
 * Wraps the given constructor and puts all created instances
 * into a list attached to the "window" object.
 */
export function CypressInstances (name) {
  return function (target) {
    // @ts-ignore
    if (!window.Cypress) {
      return target
    }

    // save a reference to the original constructor
    const original = target

    // a utility function to generate instances of a class
    function construct (constructor, args) {
      const c = function () {
        return constructor.apply(this, args)
      }

      c.prototype = constructor.prototype

      return new c()
    }

    // the new constructor behavior
    const f = function (...args) {
      const instance = construct(original, args)

      const listName = name || target.name
      // @ts-ignore

      if (!window[listName]) {
        window[listName] = []
      }

      window[listName].push(instance)

      return instance
    }

    // copy prototype so intanceof operator still works
    f.prototype = original.prototype

    return f
  }
}
