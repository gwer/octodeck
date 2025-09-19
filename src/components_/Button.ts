import { Component } from './Component';

export class Button extends Component {
  constructor() {
    super();
  }

  override render() {
    this.root.innerHTML = `
      <style>
        :host {
          display: contents;
        }

        button {
          padding: 0.5em 1em;
          border-radius: 4px;
          box-sizing: border-box;
          background-color: #eee;
          height: 2.5em;
          color: #000;
          border: 1px solid #999;
          cursor: pointer;
        }

        button:hover {
          background-color: #ddd;
        }

        button:active {
          background-color: #ccc;
        }

        :host([active]) button {
          background-color: #333;
          border: none;
          color: #fff;
        }
      </style>

      <button>
        <slot></slot>
      </button>
    `;
  }
}

customElements.define('octodeck-button', Button);
