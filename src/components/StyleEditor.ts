import { Component } from './Component';

declare global {
  interface GlobalEventHandlersEventMap {
    'styles-change': CustomEvent;
  }
}

export type Styles = {
  bgColor: string;
  headingColor: string;
  fontColor: string;
  fontSize: string;
};

type StyleEditorProps = {
  styles: Styles;
};

export class StyleEditor extends Component {
  #styles!: Styles;

  constructor({ styles }: StyleEditorProps) {
    super();
    this.#styles = styles;
  }

  set styles(value: Styles) {
    this.#styles = value;
    this.update();
  }

  get styles() {
    return this.#styles;
  }

  override render() {
    this.root.innerHTML = `
      <style>
        #style-editor {
          display: inline-flex;
          gap: 2em;
          flex-wrap: wrap;
          background-color: #fff;
          padding: 1em;
          margin: 1em;
          border-radius: 4px;
          box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.3);
          align-items: center;
        }

        label {
          display: flex;
          gap: 0.5em;
          align-items: center;
        }
      </style>

      <div id="style-editor">
        <label>
          <span>Background Color:</span>
          <input name="bgColor" type="color" value="${this.#styles.bgColor}" />
        </label>
        <label>
          <span>Heading Color:</span>
          <input name="headingColor" type="color" value="${
            this.#styles.headingColor
          }" />
        </label>
        <label>
          <span>Font Color:</span>
          <input name="fontColor" type="color" value="${
            this.#styles.fontColor
          }" />
        </label>
        <label>
          <span>Font Size:</span>
          <input name="fontSize" type="number" min="10" max="200" value="${
            this.#styles.fontSize
          }" />
        </label>
      </div>
    `;

    const styleEditor = this.root.getElementById('style-editor')!;

    styleEditor.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const name = target.name;
      const value = target.value;

      this.#styles[name as keyof Styles] = value;
      this.#emit('styles-input');
    });

    styleEditor.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      const name = target.name;
      const value = target.value;

      this.#styles[name as keyof Styles] = value;
      this.#emit('styles-change');
    });
  }

  update() {
    const styleEditor = this.root.getElementById('style-editor')!;
    const inputFields = styleEditor.querySelectorAll('input');

    inputFields.forEach((input) => {
      if (input.name in this.#styles) {
        input.value = this.#styles[input.name as keyof Styles];
      }
    });
  }

  #emit(event: string, detail?: any) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }
}

customElements.define('style-editor', StyleEditor);
