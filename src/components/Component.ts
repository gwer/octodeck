export class Component extends HTMLElement {
  protected root = this.attachShadow({ mode: 'open' });

  constructor() {
    super();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.root.innerHTML = '';
  }
}
