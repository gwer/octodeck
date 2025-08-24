import { Component } from './Component';
import './Button';

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
      </style>

      <div id="octodeck-modes">
        <octodeck-button id="edit" ${
          this.#currentMode === 'edit' ? 'active' : ''
        }>Edit</octodeck-button>
        <octodeck-button id="style" ${
          this.#currentMode === 'style' ? 'active' : ''
        }>Style</octodeck-button>
        <octodeck-button id="order" ${
          this.#currentMode === 'order' ? 'active' : ''
        }>Order</octodeck-button>
        <octodeck-button id="view" ${
          this.#currentMode === 'view' ? 'active' : ''
        }>View</octodeck-button>
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
