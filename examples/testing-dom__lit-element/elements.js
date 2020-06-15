import { LitElement, html } from 'https://unpkg.com/lit-element/lit-element.js?module'

window.customElements.define('element-one', class extends LitElement {
  static get properties () {
    return {
      _message: {
        type: String,
      },
    }
  }

  _onClick () {
    this._message = 'I am element 1!'
  }

  render () {
    return html`
      <p>${this._message || ''}</p>
      <button @click=${this._onClick}>Click me</button>
    `
  }
})

window.customElements.define('element-two', class extends LitElement {
  render () {
    return html`
      <div class="container">
        <slot></slot>
      </div>
    `
  }
})
