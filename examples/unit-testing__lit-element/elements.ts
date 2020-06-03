import {LitElement, html} from 'lit-element';

customElements.define('element-one', class extends LitElement {
  static get properties() {
    return {
      _message: {
        type: String
      }
    };
  }

  protected _message: string = '';

  _onClick(): void {
    this._message = 'I am element 1!';
  }

  render() {
    return html`
      <p>${this._message}</p>
      <button @click=${this._onClick}>Click me</button>
    `;
  }
});

customElements.define('element-two', class extends LitElement {
  render() {
    return html`
      <div class="container">
        <slot></slot>
      </div>
    `;
  }
});
