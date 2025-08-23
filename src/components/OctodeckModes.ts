import { Component } from './Component';

type OctodeckMode = 'edit' | 'style' | 'order' | 'view';

type OctodeckModesProps = {
  currentMode: OctodeckMode;
};

export class OctodeckModes extends Component {
  #currentMode: OctodeckMode;

  constructor({ currentMode }: OctodeckModesProps) {
    super();
    this.#currentMode = currentMode;
  }

  override render() {
    this.root.innerHTML = `
      <style>
        :host {
          position: fixed;
          bottom: 1rem;
          right: 1rem;
          z-index: 2;
          background-color: #fff;
          padding: 1em;
          border-radius: 4px;
          box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.3);
        }

        #octodeck-modes {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        button {
          padding: 0.5em 1em;
          border-radius: 4px;
          border: none;
          background-color: #eee;
          color: #000;
          border: 1px solid #999;
          cursor: pointer;
        }

        button:hover {
          background-color: #ddd;
        }

        button.active {
          background-color: #333;
          color: #fff;
        }
      </style>

      <div id="octodeck-modes">
        <button octodeck-button id="edit" class="${
          this.#currentMode === 'edit' ? 'active' : ''
        }">Edit</button>
        <button octodeck-button id="style" class="${
          this.#currentMode === 'style' ? 'active' : ''
        }">Style</button>
        <button octodeck-button id="order" class="${
          this.#currentMode === 'order' ? 'active' : ''
        }">Order</button>
        <button octodeck-button id="view" class="${
          this.#currentMode === 'view' ? 'active' : ''
        }">View</button>
      </div>
    `;

    const edit = this.root.getElementById('edit')!;
    const style = this.root.getElementById('style')!;
    const order = this.root.getElementById('order')!;
    const view = this.root.getElementById('view')!;

    edit.addEventListener('click', () => {
      window.location.replace(`/v1/edit${window.location.hash}`);
    });

    style.addEventListener('click', () => {
      window.location.replace(`/v1/style${window.location.hash}`);
    });

    order.addEventListener('click', () => {
      window.location.replace(`/v1/order${window.location.hash}`);
    });

    view.addEventListener('click', () => {
      window.location.replace(`/v1/view${window.location.hash}`);
    });
  }
}

customElements.define('octodeck-modes', OctodeckModes);
