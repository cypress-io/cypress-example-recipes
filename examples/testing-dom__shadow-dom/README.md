# Shadow DOM

Cypress natively supports traversing shadow DOM trees, both from a component testing point of view, and an application testing point of view.

## Explicitly traversing shadow DOM

If you are testing components, or you simply prefer writing explicit selectors, you may traverse into any given shadow DOM tree like so:

```javascript
cy
.get('my-element')
.shadow()
.find('button')
.click()

/*
  <my-element>
    #shadow-root
      <button>Click me!</button>
  </my-element>
*/
```

## Ignoring shadow boundaries

Alternatively, you may use the `includeShadowDom: true` option when traversing the DOM to look beyond each shadow root's boundary:

```javascript
cy
.get('button', { includeShadowDom: true })
.click()

/*
  <my-element>
    #shadow-root
      <button>Click me!</button>
  </my-element>
*/
```

This effectively treats the DOM as if shadow boundaries do not exist and will traverse into them like any other elements.

The following commands support the `includeShadowDom` option:

* `cy.get()`
* `cy.find()`
